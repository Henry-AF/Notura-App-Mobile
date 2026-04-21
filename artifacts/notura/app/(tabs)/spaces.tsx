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

import { ConversationCard } from "@/components/ConversationCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { mockSpaces, type Space } from "@/lib/mockData";

const SPACE_COLORS = ["#AF52DE", "#34C759", "#FF9500", "#007AFF", "#FF3B30", "#5856D6"];

function cardShadow() {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000" as const,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    };
  }
  return { elevation: 1 as const };
}

function SpaceCard({ space, onPress }: { space: Space; onPress: () => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.spaceCard, { backgroundColor: colors.card, ...cardShadow() }]}
      onPress={onPress}
      activeOpacity={0.97}
    >
      <View style={[styles.spaceIconWrap, { backgroundColor: space.color + "18" }]}>
        <Feather name={space.icon as any} size={22} color={space.color} />
      </View>
      <View style={styles.spaceBody}>
        <Text style={[styles.spaceName, { color: colors.foreground }]}>{space.name}</Text>
        {space.description && (
          <Text style={[styles.spaceDesc, { color: colors.gray500 }]} numberOfLines={1}>
            {space.description}
          </Text>
        )}
        <Text style={[styles.spaceCount, { color: colors.gray400 }]}>
          {space.conversationCount} conversation{space.conversationCount !== 1 ? "s" : ""}
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color={colors.gray300} />
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

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 100;

  if (selectedSpace) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.secondary }]}
            onPress={() => setSelectedSpace(null)}
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <View style={styles.spaceTitleRow}>
            <View style={[styles.spaceTitleIcon, { backgroundColor: selectedSpace.color + "18" }]}>
              <Feather name={selectedSpace.icon as any} size={15} color={selectedSpace.color} />
            </View>
            <Text style={[styles.spaceTitleText, { color: colors.foreground }]}>
              {selectedSpace.name}
            </Text>
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
              <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="folder" size={28} color={colors.gray300} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                No conversations yet
              </Text>
              <Text style={[styles.emptySub, { color: colors.gray500 }]}>
                Record a meeting and assign it to {selectedSpace.name}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Spaces</Text>
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
        <Text style={[styles.sectionLabel, { color: colors.gray500 }]}>YOUR SPACES</Text>
        {mockSpaces.map((space) => (
          <SpaceCard key={space.id} space={space} onPress={() => setSelectedSpace(space)} />
        ))}

        <TouchableOpacity
          style={[styles.sharedCard, { backgroundColor: colors.card, ...cardShadow() }]}
          activeOpacity={0.97}
        >
          <View style={[styles.sharedIcon, { backgroundColor: colors.info + "15" }]}>
            <Feather name="users" size={20} color={colors.info} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sharedTitle, { color: colors.foreground }]}>
              Shared with me
            </Text>
            <Text style={[styles.sharedSub, { color: colors.gray500 }]}>
              3 conversations from your team
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.gray300} />
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={createVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalRoot, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>New Space</Text>
            <TouchableOpacity
              style={[styles.modalClose, { backgroundColor: colors.secondary }]}
              onPress={() => setCreateVisible(false)}
            >
              <Feather name="x" size={18} color={colors.gray500} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <TextInput
              style={[
                styles.nameInput,
                { backgroundColor: colors.input, color: colors.foreground },
              ]}
              value={newSpaceName}
              onChangeText={setNewSpaceName}
              placeholder="Space name..."
              placeholderTextColor={colors.gray300}
              autoFocus
            />

            <Text style={[styles.colorSectionLabel, { color: colors.gray500 }]}>COLOR</Text>
            <View style={styles.colorRow}>
              {SPACE_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    selectedColor === c && styles.colorDotSelected,
                  ]}
                  onPress={() => setSelectedColor(c)}
                >
                  {selectedColor === c && (
                    <Feather name="check" size={14} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.createBtn,
                {
                  backgroundColor: newSpaceName.trim() ? colors.primary : colors.secondary,
                },
              ]}
              onPress={() => {
                if (!newSpaceName.trim()) return;
                setCreateVisible(false);
                setNewSpaceName("");
              }}
            >
              <Text
                style={[
                  styles.createBtnText,
                  { color: newSpaceName.trim() ? "#fff" : colors.gray400 },
                ]}
              >
                Create Space
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  addBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  spaceTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  spaceTitleIcon: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  spaceTitleText: { fontSize: 17, fontWeight: "600" },
  scroll: { paddingHorizontal: 20, gap: 10 },
  flatList: { paddingHorizontal: 20, paddingTop: 8 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    marginTop: 4,
    marginBottom: 2,
  },
  spaceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 16,
    padding: 16,
  },
  spaceIconWrap: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  spaceBody: { flex: 1, gap: 2 },
  spaceName: { fontSize: 15, fontWeight: "600" },
  spaceDesc: { fontSize: 12 },
  spaceCount: { fontSize: 11 },
  sharedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  sharedIcon: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  sharedTitle: { fontSize: 15, fontWeight: "500" },
  sharedSub: { fontSize: 12, marginTop: 2 },
  empty: { alignItems: "center", paddingTop: 80, gap: 10 },
  emptyIcon: { width: 72, height: 72, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle: { fontSize: 17, fontWeight: "600" },
  emptySub: { fontSize: 14, color: "#8E8E93", textAlign: "center", paddingHorizontal: 40 },
  modalRoot: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "web" ? 67 : 16,
    paddingBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: "700" },
  modalClose: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  modalBody: { paddingHorizontal: 20, gap: 16 },
  nameInput: {
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  colorSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
  },
  colorRow: { flexDirection: "row", gap: 12 },
  colorDot: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  colorDotSelected: { borderWidth: 2.5, borderColor: "#fff" },
  createBtn: { height: 52, borderRadius: 9999, alignItems: "center", justifyContent: "center", marginTop: 8 },
  createBtnText: { fontSize: 16, fontWeight: "600" },
});
