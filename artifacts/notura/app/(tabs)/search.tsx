import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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
import { SearchBar } from "@/components/SearchBar";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface SearchResult {
  type: "conversation" | "transcript" | "action";
  id: string;
  conversationId: string;
  title: string;
  excerpt: string;
  speaker?: string;
  speakerInitials?: string;
  speakerColor?: string;
  date: string;
}

const RECENT_SEARCHES = ["roadmap", "Series B", "mobile launch", "Acme Corp"];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { conversations } = useApp();
  const [query, setQuery] = useState("");

  const results = useMemo<SearchResult[]>(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    const out: SearchResult[] = [];

    for (const conv of conversations) {
      if (
        conv.title.toLowerCase().includes(q) ||
        conv.subtitle.toLowerCase().includes(q)
      ) {
        out.push({
          type: "conversation",
          id: `conv-${conv.id}`,
          conversationId: conv.id,
          title: conv.title,
          excerpt: conv.summary?.slice(0, 100) + "..." || conv.subtitle,
          date: conv.dateShort,
        });
      }

      for (const seg of conv.transcript ?? []) {
        if (seg.text.toLowerCase().includes(q)) {
          out.push({
            type: "transcript",
            id: `seg-${seg.id}`,
            conversationId: conv.id,
            title: conv.title,
            excerpt: seg.text,
            speaker: seg.speakerName,
            speakerInitials: seg.speakerInitials,
            speakerColor: seg.speakerColor,
            date: seg.timeLabel,
          });
        }
      }

      for (const action of conv.actionItems ?? []) {
        if (action.text.toLowerCase().includes(q)) {
          out.push({
            type: "action",
            id: `action-${action.id}`,
            conversationId: conv.id,
            title: action.text,
            excerpt: `From: ${conv.title}`,
            speaker: action.assignee,
            speakerInitials: action.assigneeInitials,
            speakerColor: action.assigneeColor,
            date: action.dueDate ?? conv.dateShort,
          });
        }
      }
    }

    return out.slice(0, 20);
  }, [query, conversations]);

  function highlight(text: string, q: string) {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return text;
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;

  const typeIcon: Record<string, string> = {
    conversation: "calendar",
    transcript: "file-text",
    action: "check-square",
  };
  const typeLabel: Record<string, string> = {
    conversation: "Meeting",
    transcript: "Transcript",
    action: "Action Item",
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Search</Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search across all conversations..."
        />
      </View>

      {query.length < 2 && (
        <View style={styles.body}>
          <Text style={[styles.sectionLabel, { color: colors.gray500 }]}>
            Recent searches
          </Text>
          <View style={styles.recentChips}>
            {RECENT_SEARCHES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.recentChip,
                  { backgroundColor: colors.secondary },
                ]}
                onPress={() => setQuery(s)}
              >
                <Feather name="clock" size={12} color={colors.gray400} />
                <Text style={[styles.recentText, { color: colors.gray600 }]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.gray500 }]}>
            Search by type
          </Text>
          {[
            { icon: "file-text", label: "Transcripts", sub: "Search inside conversation text" },
            { icon: "check-square", label: "Action Items", sub: "Find tasks from meetings" },
            { icon: "bookmark", label: "Highlights", sub: "Browse saved moments" },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.typeRow,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.typeIcon,
                  { backgroundColor: colors.brandSubtle },
                ]}
              >
                <Feather name={item.icon as any} size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.typeLabel, { color: colors.foreground }]}>
                  {item.label}
                </Text>
                <Text style={[styles.typeSub, { color: colors.gray500 }]}>
                  {item.sub}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.gray300} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {query.length >= 2 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.resultsList,
            {
              paddingBottom:
                Platform.OS === "web" ? 34 + 84 : insets.bottom + 100,
            },
          ]}
          ListHeaderComponent={
            results.length > 0 ? (
              <Text style={[styles.resultsCount, { color: colors.gray500 }]}>
                {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.resultCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => router.push(`/conversation/${item.conversationId}`)}
              activeOpacity={0.7}
            >
              <View style={styles.resultHeader}>
                <View
                  style={[
                    styles.resultTypeIcon,
                    { backgroundColor: colors.brandSubtle },
                  ]}
                >
                  <Feather
                    name={typeIcon[item.type] as any}
                    size={13}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.resultType, { color: colors.primary }]}>
                  {typeLabel[item.type]}
                </Text>
                <Text style={[styles.resultDate, { color: colors.gray400 }]}>
                  {item.date}
                </Text>
              </View>

              <Text style={[styles.resultTitle, { color: colors.foreground }]}>
                {item.title}
              </Text>

              {item.speakerInitials && (
                <View style={styles.resultSpeaker}>
                  <Avatar
                    initials={item.speakerInitials}
                    color={item.speakerColor ?? "#5341CD"}
                    size={18}
                  />
                  <Text style={[styles.resultSpeakerName, { color: colors.gray500 }]}>
                    {item.speaker}
                  </Text>
                </View>
              )}

              <Text
                style={[styles.resultExcerpt, { color: colors.gray600 }]}
                numberOfLines={2}
              >
                {item.excerpt}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="search" size={36} color={colors.gray300} />
              <Text style={[styles.emptyTitle, { color: colors.gray500 }]}>
                No results for "{query}"
              </Text>
              <Text style={[styles.emptySub, { color: colors.gray400 }]}>
                Try a different keyword or phrase
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  body: { paddingHorizontal: 20, gap: 12 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 8,
  },
  recentChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9999,
  },
  recentText: { fontSize: 13 },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 14,
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  typeLabel: { fontSize: 14, fontWeight: "500" },
  typeSub: { fontSize: 12 },
  resultsList: { paddingHorizontal: 20, paddingTop: 8, gap: 10 },
  resultsCount: { fontSize: 12, marginBottom: 4 },
  resultCard: {
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 14,
    gap: 6,
    marginBottom: 8,
  },
  resultHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  resultTypeIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  resultType: { fontSize: 11, fontWeight: "600", flex: 1 },
  resultDate: { fontSize: 11 },
  resultTitle: { fontSize: 14, fontWeight: "600" },
  resultSpeaker: { flexDirection: "row", alignItems: "center", gap: 6 },
  resultSpeakerName: { fontSize: 11 },
  resultExcerpt: { fontSize: 13, lineHeight: 19 },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  emptySub: { fontSize: 13 },
});
