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

const SPACE_COLORS = ["#5341CD", "#1D9E75", "#EF9F27", "#378ADD", "#E24B4A", "#707090"];
const SPACE_ICONS = ["briefcase", "code", "star", "user", "globe", "heart", "zap", "book"];

function SpaceCard({ space, onPress }: { space: Space; onPress: () => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[
        styles.spaceCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.spaceIcon, { backgroundColor: space.color + "20" }]}
      >
        <Feather name={space.icon as any} size={22} color={space.color} />
      </View>
      <View style={styles.spaceInfo}>
        <Text style={[styles.spaceName, { color: colors.foreground }]}>
          {space.name}
        </Text>
        {space.description && (
          <Text style={[styles.spaceDesc, { color: colors.gray500 }]} numberOfLines={1}>
            {space.description}
          </Text>
        )}
        <Text style={[styles.spaceCount, { color: colors.gray400 }]}>
          {space.conversationCount} conversation{space.conversationCount !== 1 ? "s" : ""}
        </Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.gray300} />
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

  if (selectedSpace) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad }]}>
          <TouchableOpacity
            onPress={() => setSelectedSpace(null)}
            style={styles.backBtn}
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <View style={styles.spaceTitleRow}>
            <View
              style={[
                styles.spaceHeaderIcon,
                { backgroundColor: selectedSpace.color + "20" },
              ]}
            >
              <Feather
                name={selectedSpace.icon as any}
                size={16}
                color={selectedSpace.color}
              />
            </View>
            <Text style={[styles.spaceHeaderTitle, { color: colors.foreground }]}>
              {selectedSpace.name}
            </Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <FlatList
          data={spaceConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ConversationCard conversation={item} />}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 },
          ]}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="folder" size={36} color={colors.gray300} />
              <Text style={[styles.emptyTitle, { color: colors.gray500 }]}>
                No conversations in {selectedSpace.name}
              </Text>
              <Text style={[styles.emptySub, { color: colors.gray400 }]}>
                Record or move a conversation here
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
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.gray500 }]}>
          Your spaces
        </Text>
        {mockSpaces.map((space) => (
          <SpaceCard
            key={space.id}
            space={space}
            onPress={() => setSelectedSpace(space)}
          />
        ))}

        <View
          style={[
            styles.sharedBanner,
            { backgroundColor: colors.brandSubtle, borderColor: colors.border },
          ]}
        >
          <Feather name="users" size={18} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.sharedTitle, { color: colors.primary }]}>
              Shared with me
            </Text>
            <Text style={[styles.sharedSub, { color: colors.gray500 }]}>
              3 conversations from team members
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.primary} />
        </View>
      </ScrollView>

      <Modal visible={createVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalRoot, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>New Space</Text>
            <TouchableOpacity onPress={() => setCreateVisible(false)}>
              <Feather name="x" size={22} color={colors.gray500} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <TextInput
              style={[
                styles.nameInput,
                { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground },
              ]}
              value={newSpaceName}
              onChangeText={setNewSpaceName}
              placeholder="Space name..."
              placeholderTextColor={colors.gray300}
              autoFocus
            />
            <Text style={[styles.colorLabel, { color: colors.gray600 }]}>Color</Text>
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
                { backgroundColor: newSpaceName.trim() ? colors.primary : colors.secondary },
              ]}
              onPress={() => {
                if (!newSpaceName.trim()) return;
                setCreateVisible(false);
                setNewSpaceName("");
              }}
            >
              <Text
                style={[
                  styles.createText,
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
  addBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  spaceTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  spaceHeaderIcon: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  spaceHeaderTitle: { fontSize: 17, fontWeight: "600" },
  scroll: { paddingHorizontal: 20, gap: 10 },
  list: { paddingHorizontal: 20, paddingTop: 8 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  spaceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 14,
  },
  spaceIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  spaceInfo: { flex: 1, gap: 2 },
  spaceName: { fontSize: 15, fontWeight: "600" },
  spaceDesc: { fontSize: 12 },
  spaceCount: { fontSize: 11 },
  sharedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 14,
    marginTop: 8,
  },
  sharedTitle: { fontSize: 14, fontWeight: "600" },
  sharedSub: { fontSize: 12, marginTop: 1 },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  emptySub: { fontSize: 13 },
  modalRoot: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: Platform.OS === "web" ? 67 : 16,
  },
  modalTitle: { fontSize: 20, fontWeight: "700" },
  modalBody: { padding: 20, gap: 16 },
  nameInput: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  colorLabel: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  colorRow: { flexDirection: "row", gap: 12 },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  colorDotSelected: { borderWidth: 2, borderColor: "#fff" },
  createBtn: {
    height: 52,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  createText: { fontSize: 16, fontWeight: "600" },
});
