import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const TAGS = ["All", "Key Metric", "Risk", "Decision", "Highlight"];

export default function HighlightsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { highlights, removeHighlight } = useApp();
  const [activeTag, setActiveTag] = useState("All");

  const filtered = activeTag === "All"
    ? highlights
    : highlights.filter((h) => h.tag === activeTag);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 24;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.secondary }]}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Highlights</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(h) => h.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        ListHeaderComponent={
          <View style={styles.tags}>
            {TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagChip,
                  {
                    backgroundColor: activeTag === tag ? colors.primary : colors.secondary,
                  },
                ]}
                onPress={() => setActiveTag(tag)}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: activeTag === tag ? "#fff" : colors.gray600 },
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        }
        renderItem={({ item: h }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderLeftColor: h.speakerColor,
                borderLeftWidth: 3,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Avatar initials={h.speakerInitials} color={h.speakerColor} size={24} />
              <Text style={[styles.speaker, { color: h.speakerColor }]}>
                {h.speakerName}
              </Text>
              <Text style={[styles.time, { color: colors.gray400 }]}>{h.timeLabel}</Text>
              {h.tag && <Badge label={h.tag} variant="primary" />}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeHighlight(h.id)}
              >
                <Feather name="trash-2" size={13} color={colors.gray300} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.text, { color: colors.gray700 }]}>
              "{h.text}"
            </Text>

            <TouchableOpacity
              style={styles.source}
              onPress={() => router.push(`/conversation/${h.conversationId}`)}
            >
              <Feather name="file-text" size={11} color={colors.gray400} />
              <Text style={[styles.sourceText, { color: colors.gray400 }]}>
                {h.conversationTitle}
              </Text>
              <Text style={[styles.date, { color: colors.gray300 }]}>
                {h.createdAt}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bookmark" size={36} color={colors.gray300} />
            <Text style={[styles.emptyTitle, { color: colors.gray500 }]}>
              No highlights yet
            </Text>
            <Text style={[styles.emptySub, { color: colors.gray400 }]}>
              Bookmark key moments inside conversations
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
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
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "700" },
  list: { paddingHorizontal: 20, gap: 10 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  tagChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 9999 },
  tagText: { fontSize: 13, fontWeight: "500" },
  card: { borderRadius: 16, borderWidth: 0.5, padding: 14, gap: 10, marginBottom: 2 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  speaker: { fontSize: 12, fontWeight: "600", flex: 1 },
  time: { fontSize: 11 },
  deleteBtn: { padding: 4 },
  text: { fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  source: { flexDirection: "row", alignItems: "center", gap: 5 },
  sourceText: { fontSize: 11, flex: 1 },
  date: { fontSize: 11 },
  empty: { alignItems: "center", paddingTop: 80, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  emptySub: { fontSize: 13 },
});
