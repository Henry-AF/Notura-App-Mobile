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

export default function HighlightsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { highlights, removeHighlight } = useApp();
  const [activeTag, setActiveTag] = useState("All");

  const filtered =
    activeTag === "All" ? highlights : highlights.filter((h) => h.tag === activeTag);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 24;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.secondary }]}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Highlights</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(h) => h.id}
        showsVerticalScrollIndicator={false}
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
                activeOpacity={0.8}
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
                borderLeftColor: h.speakerColor,
                ...cardShadow(),
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Avatar initials={h.speakerInitials} color={h.speakerColor} size={24} />
              <Text style={[styles.speakerName, { color: h.speakerColor }]}>{h.speakerName}</Text>
              <Text style={[styles.time, { color: colors.gray400 }]}>{h.timeLabel}</Text>
              {h.tag && <Badge label={h.tag} variant="primary" />}
              <TouchableOpacity onPress={() => removeHighlight(h.id)} style={styles.deleteBtn}>
                <Feather name="trash-2" size={13} color={colors.gray300} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.quote, { color: colors.gray700 }]}>"{h.text}"</Text>

            <TouchableOpacity
              style={styles.source}
              onPress={() => router.push(`/conversation/${h.conversationId}`)}
              activeOpacity={0.7}
            >
              <Feather name="file-text" size={11} color={colors.gray400} />
              <Text style={[styles.sourceTitle, { color: colors.gray400 }]}>{h.conversationTitle}</Text>
              <Text style={[styles.sourceDate, { color: colors.gray300 }]}>{h.createdAt}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="bookmark" size={28} color={colors.gray300} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No highlights yet
            </Text>
            <Text style={[styles.emptySub, { color: colors.gray500 }]}>
              Bookmark key moments inside conversations to see them here
            </Text>
          </View>
        }
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
  list: { paddingHorizontal: 20, paddingTop: 4 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  tagChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9999 },
  tagText: { fontSize: 13, fontWeight: "500" },
  card: {
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  speakerName: { fontSize: 12, fontWeight: "600", flex: 1 },
  time: { fontSize: 11 },
  deleteBtn: { padding: 4 },
  quote: { fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  source: { flexDirection: "row", alignItems: "center", gap: 5 },
  sourceTitle: { fontSize: 11, flex: 1 },
  sourceDate: { fontSize: 11 },
  empty: { alignItems: "center", paddingTop: 80, gap: 10 },
  emptyIcon: { width: 72, height: 72, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle: { fontSize: 17, fontWeight: "600" },
  emptySub: { fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
});
