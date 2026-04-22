import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppNavbar } from "@/components/AppNavbar";
import { ConversationCard } from "@/components/ConversationCard";
import { GlassCard } from "@/components/GlassCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { mockSpaces, type Space } from "@/lib/mockData";

const SPACE_COLORS = ["#AF52DE", "#34C759", "#FF9500", "#007AFF", "#FF3B30", "#5856D6"];

function SpaceCard({ space, onPress }: { space: Space; onPress: () => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <GlassCard noPad>
        <View style={styles.spaceInner}>
          <View style={[styles.spaceIconWrap, { backgroundColor: space.color + "18" }]}>
            <Feather name={space.icon as any} size={22} color={space.color} />
          </View>
          <View style={styles.spaceBody}>
            <Text style={[styles.spaceName, { color: colors.heading }]}>{space.name}</Text>
            {space.description && (
              <Text style={[styles.spaceDesc, { color: colors.bodyText }]} numberOfLines={1}>{space.description}</Text>
            )}
            <Text style={[styles.spaceCount, { color: colors.gray400 }]}>
              {space.conversationCount} conversa{space.conversationCount !== 1 ? "s" : ""}
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.gray400} />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

export default function SpacesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { conversations } = useApp();
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [selectedColor, setSelectedColor] = useState(SPACE_COLORS[0]);

  const spaceConversations = useMemo(() => {
    if (!selectedSpace) return [];
    return conversations.filter((c) => c.spaceId === selectedSpace.id);
  }, [conversations, selectedSpace]);

  const bottomPad = Platform.OS === "web" ? 34 + 100 : insets.bottom + 110;

  if (selectedSpace) {
    return (
      <View style={styles.root}>
        <AppNavbar title={selectedSpace.name} />
        <View style={styles.subHeader}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: "rgba(175,82,222,0.08)" }]}
            onPress={() => setSelectedSpace(null)}
          >
            <Feather name="arrow-left" size={20} color={colors.heading} />
          </TouchableOpacity>
          <View style={styles.spaceTitleRow}>
            <View style={[styles.spaceTitleIcon, { backgroundColor: selectedSpace.color + "18" }]}>
              <Feather name={selectedSpace.icon as any} size={15} color={selectedSpace.color} />
            </View>
            <Text style={[styles.spaceTitleText, { color: colors.heading }]}>{selectedSpace.name}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <FlatList
          data={spaceConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ConversationCard conversation={item} />}
          contentContainerStyle={[styles.flatList, { paddingBottom: bottomPad }]}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: "rgba(175,82,222,0.08)" }]}>
                <Feather name="folder" size={28} color={colors.gray400} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.heading }]}>Nenhuma conversa aqui</Text>
              <Text style={[styles.emptySub, { color: colors.bodyText }]}>
                Grave uma reunião e atribua a {selectedSpace.name}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AppNavbar title="Espaços" />
      <View style={styles.subHeader}>
        <View style={{ width: 40 }} />
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => setCreateVisible(true)}
        >
          <Feather name="plus" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.bodyText }]}>Seus espaços</Text>
        {mockSpaces.map((space) => (
          <SpaceCard key={space.id} space={space} onPress={() => setSelectedSpace(space)} />
        ))}

        <GlassCard noPad>
          <TouchableOpacity style={styles.sharedInner} activeOpacity={0.9}>
            <View style={[styles.sharedIcon, { backgroundColor: "rgba(0,122,255,0.10)" }]}>
              <Feather name="users" size={20} color="#007AFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sharedTitle, { color: colors.heading }]}>Compartilhados comigo</Text>
              <Text style={[styles.sharedSub, { color: colors.bodyText }]}>3 conversas da sua equipe</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.gray400} />
          </TouchableOpacity>
        </GlassCard>
      </ScrollView>

      <Modal visible={createVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalRoot, { backgroundColor: "#FAFAFA" }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.heading }]}>Novo Espaço</Text>
            <TouchableOpacity
              style={[styles.modalClose, { backgroundColor: "rgba(175,82,222,0.08)" }]}
              onPress={() => setCreateVisible(false)}
            >
              <Feather name="x" size={18} color={colors.bodyText} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <TextInput
              style={[styles.nameInput, { backgroundColor: "rgba(175,82,222,0.06)", color: colors.heading, borderColor: "rgba(175,82,222,0.15)", borderWidth: 1 }]}
              value={newSpaceName}
              onChangeText={setNewSpaceName}
              placeholder="Nome do espaço..."
              placeholderTextColor="#B0A0C8"
              autoFocus
            />
            <Text style={[styles.colorSectionLabel, { color: colors.bodyText }]}>COR</Text>
            <View style={styles.colorRow}>
              {SPACE_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotSelected]}
                  onPress={() => setSelectedColor(c)}
                >
                  {selectedColor === c && <Feather name="check" size={14} color="#fff" />}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: newSpaceName.trim() ? colors.primary : "rgba(175,82,222,0.12)" }]}
              onPress={() => {
                if (!newSpaceName.trim()) return;
                setCreateVisible(false);
                setNewSpaceName("");
              }}
            >
              <Text style={[styles.createBtnText, { color: newSpaceName.trim() ? "#fff" : colors.gray400 }]}>
                Criar Espaço
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  subHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 10 },
  addBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  spaceTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  spaceTitleIcon: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  spaceTitleText: { fontSize: 17, fontWeight: "600" },
  scroll: { paddingHorizontal: 20, gap: 10 },
  flatList: { paddingHorizontal: 20, paddingTop: 8 },
  sectionLabel: { fontSize: 13, fontWeight: "500", marginTop: 4, marginBottom: 2 },
  spaceInner: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  spaceIconWrap: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  spaceBody: { flex: 1, gap: 2 },
  spaceName: { fontSize: 15, fontWeight: "600" },
  spaceDesc: { fontSize: 12 },
  spaceCount: { fontSize: 11 },
  sharedInner: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  sharedIcon: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  sharedTitle: { fontSize: 15, fontWeight: "500" },
  sharedSub: { fontSize: 12, marginTop: 2 },
  empty: { alignItems: "center", paddingTop: 80, gap: 10 },
  emptyIcon: { width: 72, height: 72, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle: { fontSize: 17, fontWeight: "600" },
  emptySub: { fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
  modalRoot: { flex: 1 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: "700" },
  modalClose: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  modalBody: { paddingHorizontal: 20, gap: 16 },
  nameInput: { height: 52, borderRadius: 14, paddingHorizontal: 16, fontSize: 16 },
  colorSectionLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.6 },
  colorRow: { flexDirection: "row", gap: 12 },
  colorDot: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  colorDotSelected: { borderWidth: 2.5, borderColor: "#fff" },
  createBtn: { height: 52, borderRadius: 9999, alignItems: "center", justifyContent: "center", marginTop: 8 },
  createBtnText: { fontSize: 16, fontWeight: "600" },
});
