import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { WaveformBars } from "@/components/WaveformBars";
import { useColors } from "@/hooks/useColors";
import type { Conversation, ConversationStatus } from "@/lib/mockData";

interface ConversationCardProps {
  conversation: Conversation;
}

function statusVariant(s: ConversationStatus) {
  switch (s) {
    case "completed": return "success";
    case "recording": return "error";
    case "processing": return "warning";
    case "failed": return "error";
  }
}

function statusLabel(s: ConversationStatus) {
  switch (s) {
    case "completed": return "Concluído";
    case "recording": return "Gravando";
    case "processing": return "Processando";
    case "failed": return "Falhou";
  }
}

export function ConversationCard({ conversation: conv }: ConversationCardProps) {
  const colors = useColors();
  const router = useRouter();

  const openActions = (conv.actionItems ?? []).filter((a) => !a.completed).length;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: conv.status === "recording" ? colors.error + "30" : colors.border,
          borderWidth: conv.status === "recording" ? 1.5 : Platform.OS === "ios" ? 0 : 0.5,
        },
        Platform.OS === "ios" && {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        Platform.OS === "android" && { elevation: 2 },
      ]}
      activeOpacity={0.97}
      onPress={() => router.push(`/conversation/${conv.id}`)}
    >
      {conv.status === "recording" && (
        <View style={styles.recordingBanner}>
          <WaveformBars isActive barCount={10} color={colors.error} height={18} compact />
          <Text style={[styles.recordingText, { color: colors.error }]}>Ao Vivo</Text>
        </View>
      )}

      <View style={styles.main}>
        <View style={styles.body}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {conv.title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.gray500 }]} numberOfLines={1}>
            {conv.subtitle}
          </Text>
          <View style={styles.meta}>
            <Text style={[styles.metaText, { color: colors.gray400 }]}>
              {conv.dateShort}
            </Text>
            <View style={[styles.metaDot, { backgroundColor: colors.gray300 }]} />
            <Text style={[styles.metaText, { color: colors.gray400 }]}>
              {conv.duration}
            </Text>
            {conv.wordCount && conv.wordCount > 0 ? (
              <>
                <View style={[styles.metaDot, { backgroundColor: colors.gray300 }]} />
                <Text style={[styles.metaText, { color: colors.gray400 }]}>
                  {(conv.wordCount / 1000).toFixed(1)}k palavras
                </Text>
              </>
            ) : null}
          </View>

          <View style={styles.footer}>
            <View style={styles.speakers}>
              {conv.speakers.slice(0, 3).map((s, idx) => (
                <View
                  key={s.id}
                  style={[
                    styles.speakerWrap,
                    { marginLeft: idx > 0 ? -8 : 0, borderColor: colors.card },
                  ]}
                >
                  <Avatar initials={s.initials} color={s.color} size={22} />
                </View>
              ))}
              {conv.speakers.length > 3 && (
                <View
                  style={[
                    styles.speakerMore,
                    { backgroundColor: colors.secondary, marginLeft: -8, borderColor: colors.card },
                  ]}
                >
                  <Text style={[styles.speakerMoreText, { color: colors.gray500 }]}>
                    +{conv.speakers.length - 3}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.badges}>
              <Badge label={statusLabel(conv.status)} variant={statusVariant(conv.status)} dot />
              {openActions > 0 && (
                <Badge label={`${openActions} ação${openActions > 1 ? "ões" : ""}`} variant="primary" />
              )}
            </View>
          </View>
        </View>

        <Feather name="chevron-right" size={16} color={colors.gray300} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    gap: 10,
  },
  recordingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recordingText: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  main: { flexDirection: "row", alignItems: "center", gap: 8 },
  body: { flex: 1, gap: 3 },
  title: { fontSize: 15, fontWeight: "600", letterSpacing: -0.2 },
  subtitle: { fontSize: 13 },
  meta: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  metaText: { fontSize: 12 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  speakers: { flexDirection: "row", alignItems: "center" },
  speakerWrap: { borderRadius: 11, borderWidth: 1.5 },
  speakerMore: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  speakerMoreText: { fontSize: 9, fontWeight: "600" },
  badges: { flexDirection: "row", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" },
});
