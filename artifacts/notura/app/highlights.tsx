import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppNavbar } from "@/components/AppNavbar";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { GlassBackground } from "@/components/GlassBackground";
import { GlassCard } from "@/components/GlassCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const TAGS = ["Todos", "Métrica", "Risco", "Decisão", "Destaque"];

export default function HighlightsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { highlights, removeHighlight } = useApp();
  const [activeTag, setActiveTag] = useState("Todos");

  const filtered = activeTag === "Todos" ? highlights : highlights.filter((h) => h.tag === activeTag);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 24;

  return (
    <GlassBackground>
      <View style={styles.root}>
        <AppNavbar title="Destaques" />

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
                  style={[styles.tagChip, {
                    backgroundColor: activeTag === tag ? colors.primary : "rgba(175,82,222,0.08)",
                    borderColor: activeTag === tag ? colors.primary : "rgba(175,82,222,0.15)",
                    borderWidth: 1,
                  }]}
                  onPress={() => setActiveTag(tag)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tagText, { color: activeTag === tag ? "#fff" : colors.heading }]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          }
          renderItem={({ item: h }) => (
            <GlassCard noPad style={{ borderLeftWidth: 3, borderLeftColor: h.speakerColor, marginBottom: 10 }}>
              <View style={styles.cardInner}>
                <View style={styles.cardHeader}>
                  <Avatar initials={h.speakerInitials} color={h.speakerColor} size={24} />
                  <Text style={[styles.speakerName, { color: h.speakerColor }]}>{h.speakerName}</Text>
                  <Text style={[styles.time, { color: colors.gray400 }]}>{h.timeLabel}</Text>
                  {h.tag && <Badge label={h.tag} variant="primary" />}
                  <TouchableOpacity onPress={() => removeHighlight(h.id)} style={styles.deleteBtn}>
                    <Feather name="trash-2" size={13} color={colors.gray300} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.quote, { color: colors.heading }]}>"{h.text}"</Text>
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
            </GlassCard>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: "rgba(175,82,222,0.08)" }]}>
                <Feather name="bookmark" size={28} color={colors.gray400} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.heading }]}>Sem destaques</Text>
              <Text style={[styles.emptySub, { color: colors.bodyText }]}>
                Marque momentos importantes dentro das conversas para vê-los aqui
              </Text>
            </View>
          }
        />
      </View>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { paddingHorizontal: 20, paddingTop: 4 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  tagChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9999 },
  tagText: { fontSize: 13, fontWeight: "500" },
  cardInner: { padding: 14, gap: 10 },
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
