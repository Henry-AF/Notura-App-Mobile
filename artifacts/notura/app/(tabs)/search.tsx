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

const RECENT_SEARCHES = ["roadmap", "Series B", "lançamento mobile", "Acme Corp"];

const SEARCH_TYPES = [
  { icon: "file-text", label: "Transcrições", sub: "Buscar dentro do texto das conversas" },
  { icon: "check-square", label: "Itens de ação", sub: "Encontrar tarefas das reuniões" },
  { icon: "bookmark", label: "Destaques", sub: "Ver momentos salvos" },
];

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
      if (conv.title.toLowerCase().includes(q) || conv.subtitle.toLowerCase().includes(q)) {
        out.push({
          type: "conversation",
          id: `conv-${conv.id}`,
          conversationId: conv.id,
          title: conv.title,
          excerpt: conv.summary?.slice(0, 110) + "..." || conv.subtitle,
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
            excerpt: `De: ${conv.title}`,
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

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 100;

  const typeConfig: Record<string, { icon: string; label: string }> = {
    conversation: { icon: "calendar", label: "Reunião" },
    transcript: { icon: "file-text", label: "Transcrição" },
    action: { icon: "check-square", label: "Ação" },
  };

  function cardShadow() {
    if (Platform.OS === "ios") {
      return { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12 };
    }
    return { elevation: 1 };
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Buscar</Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar conversas, transcrições..."
        />
      </View>

      {query.length < 2 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.sectionLabel, { color: colors.gray500 }]}>Recentes</Text>
          <View style={styles.recentChips}>
            {RECENT_SEARCHES.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.recentChip, { backgroundColor: colors.secondary }]}
                onPress={() => setQuery(s)}
                activeOpacity={0.75}
              >
                <Feather name="clock" size={12} color={colors.gray400} />
                <Text style={[styles.recentText, { color: colors.gray600 }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.gray500 }]}>Explorar por tipo</Text>
          {SEARCH_TYPES.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.typeRow, { backgroundColor: colors.card, ...cardShadow() }]}
              activeOpacity={0.97}
            >
              <View style={[styles.typeIconWrap, { backgroundColor: colors.brandSubtle }]}>
                <Feather name={item.icon as any} size={16} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.typeLabel, { color: colors.foreground }]}>{item.label}</Text>
                <Text style={[styles.typeSub, { color: colors.gray500 }]}>{item.sub}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.gray300} />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.resultList, { paddingBottom: bottomPad }]}
          ListHeaderComponent={
            results.length > 0 ? (
              <Text style={[styles.resultCount, { color: colors.gray500 }]}>
                {results.length} resultado{results.length !== 1 ? "s" : ""} para "{query}"
              </Text>
            ) : null
          }
          renderItem={({ item }) => {
            const tc = typeConfig[item.type];
            return (
              <TouchableOpacity
                style={[styles.resultCard, { backgroundColor: colors.card, ...cardShadow() }]}
                onPress={() => router.push(`/conversation/${item.conversationId}`)}
                activeOpacity={0.97}
              >
                <View style={styles.resultHeader}>
                  <View style={[styles.resultTypeIcon, { backgroundColor: colors.brandSubtle }]}>
                    <Feather name={tc.icon as any} size={12} color={colors.primary} />
                  </View>
                  <Text style={[styles.resultType, { color: colors.primary }]}>{tc.label}</Text>
                  <Text style={[styles.resultDate, { color: colors.gray400 }]}>{item.date}</Text>
                </View>
                <Text style={[styles.resultTitle, { color: colors.foreground }]}>{item.title}</Text>
                {item.speakerInitials && (
                  <View style={styles.resultSpeaker}>
                    <Avatar initials={item.speakerInitials} color={item.speakerColor!} size={16} />
                    <Text style={[styles.resultSpeakerName, { color: colors.gray500 }]}>
                      {item.speaker}
                    </Text>
                  </View>
                )}
                <Text style={[styles.resultExcerpt, { color: colors.gray600 }]} numberOfLines={2}>
                  {item.excerpt}
                </Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="search" size={28} color={colors.gray300} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                Nenhum resultado
              </Text>
              <Text style={[styles.emptySub, { color: colors.gray500 }]}>
                Tente uma palavra-chave diferente
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, gap: 12 },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  emptyState: { paddingHorizontal: 20, gap: 12 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 8,
  },
  recentChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  recentText: { fontSize: 13 },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  typeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  typeLabel: { fontSize: 14, fontWeight: "500" },
  typeSub: { fontSize: 12, marginTop: 1 },
  resultList: { paddingHorizontal: 20, paddingTop: 8, gap: 8 },
  resultCount: { fontSize: 12, marginBottom: 4 },
  resultCard: { borderRadius: 16, padding: 14, gap: 7, marginBottom: 8 },
  resultHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  resultTypeIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  resultType: { fontSize: 11, fontWeight: "600", flex: 1 },
  resultDate: { fontSize: 11 },
  resultTitle: { fontSize: 14, fontWeight: "600" },
  resultSpeaker: { flexDirection: "row", alignItems: "center", gap: 5 },
  resultSpeakerName: { fontSize: 11 },
  resultExcerpt: { fontSize: 13, lineHeight: 19 },
  empty: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 17, fontWeight: "600" },
  emptySub: { fontSize: 14, textAlign: "center" },
});
