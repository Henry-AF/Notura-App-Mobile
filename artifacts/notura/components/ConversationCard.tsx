import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { GlassCard } from "@/components/GlassCard";
import { WaveformBars } from "@/components/WaveformBars";
import { useColors } from "@/hooks/useColors";
import type { Conversation, ConversationStatus } from "@/lib/mockData";

interface ConversationCardProps {
  conversation: Conversation;
}

function statusVariant(s: ConversationStatus) {
  switch (s) {
    case "completed": return { bg: "rgba(52,199,89,0.12)", color: "#34C759" };
    case "recording": return { bg: "rgba(255,59,48,0.10)", color: "#FF3B30" };
    case "processing": return { bg: "rgba(255,149,0,0.12)", color: "#FF9500" };
    case "failed": return { bg: "rgba(255,59,48,0.10)", color: "#FF3B30" };
  }
}

function statusLabel(s: ConversationStatus) {
  switch (s) {
    case "completed": return "Concluído";
    case "recording": return "Ao Vivo";
    case "processing": return "Processando";
    case "failed": return "Falhou";
  }
}

export function ConversationCard({ conversation: conv }: ConversationCardProps) {
  const colors = useColors();
  const router = useRouter();
  const sv = statusVariant(conv.status);
  const openActions = (conv.actionItems ?? []).filter((a) => !a.completed).length;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/conversation/${conv.id}`)}
      style={styles.touchable}
    >
      <GlassCard noPad style={conv.status === "recording" ? { borderColor: "rgba(255,59,48,0.3)" } : undefined}>
        {conv.status === "recording" && (
          <View style={styles.liveBanner}>
            <WaveformBars isActive barCount={8} color="#FF3B30" height={14} compact />
            <Text style={[styles.liveText, { color: "#FF3B30" }]}>AO VIVO</Text>
          </View>
        )}
        <View style={styles.inner}>
          <View style={[styles.iconWrap, { backgroundColor: "rgba(175,82,222,0.10)" }]}>
            <Feather name="file-text" size={18} color={colors.primary} />
          </View>
          <View style={styles.body}>
            <Text style={[styles.title, { color: colors.heading }]} numberOfLines={1}>
              {conv.title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.bodyText }]} numberOfLines={1}>
              {conv.subtitle}
            </Text>
            <View style={styles.meta}>
              <Text style={[styles.metaText, { color: colors.gray400 }]}>{conv.dateShort}</Text>
              <View style={[styles.dot, { backgroundColor: colors.gray300 }]} />
              <Text style={[styles.metaText, { color: colors.gray400 }]}>{conv.duration}</Text>
              {conv.wordCount && conv.wordCount > 0 ? (
                <>
                  <View style={[styles.dot, { backgroundColor: colors.gray300 }]} />
                  <Text style={[styles.metaText, { color: colors.gray400 }]}>
                    {(conv.wordCount / 1000).toFixed(1)}k palavras
                  </Text>
                </>
              ) : null}
            </View>
            <View style={styles.footer}>
              <View style={styles.speakers}>
                {conv.speakers.slice(0, 3).map((s, idx) => (
                  <View key={s.id} style={[styles.speakerWrap, { marginLeft: idx > 0 ? -7 : 0, borderColor: colors.glassBg }]}>
                    <Avatar initials={s.initials} color={s.color} size={22} />
                  </View>
                ))}
              </View>
              <View style={styles.badges}>
                <View style={[styles.pill, { backgroundColor: sv.bg }]}>
                  <View style={[styles.pillDot, { backgroundColor: sv.color }]} />
                  <Text style={[styles.pillText, { color: sv.color }]}>{statusLabel(conv.status)}</Text>
                </View>
                {openActions > 0 && (
                  <View style={[styles.pill, { backgroundColor: colors.brandSubtle }]}>
                    <Text style={[styles.pillText, { color: colors.primary }]}>
                      {openActions} ação{openActions > 1 ? "ões" : ""}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <Feather name="chevron-right" size={15} color={colors.gray300} />
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: { marginBottom: 10 },
  liveBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  liveText: { fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  inner: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  iconWrap: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: "500" },
  subtitle: { fontSize: 12 },
  meta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  metaText: { fontSize: 11 },
  dot: { width: 3, height: 3, borderRadius: 1.5 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 7 },
  speakers: { flexDirection: "row" },
  speakerWrap: { borderWidth: 1.5, borderRadius: 11 },
  badges: { flexDirection: "row", gap: 5 },
  pill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9999 },
  pillDot: { width: 5, height: 5, borderRadius: 2.5 },
  pillText: { fontSize: 11, fontWeight: "500" },
});
