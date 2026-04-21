import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { WaveformBars } from "@/components/WaveformBars";
import { useColors } from "@/hooks/useColors";
import type { Conversation, ConversationStatus } from "@/lib/mockData";

interface ConversationCardProps {
  conversation: Conversation;
  compact?: boolean;
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
    case "completed": return "Done";
    case "recording": return "Recording";
    case "processing": return "Processing";
    case "failed": return "Failed";
  }
}

export function ConversationCard({ conversation: conv, compact = false }: ConversationCardProps) {
  const colors = useColors();
  const router = useRouter();

  const actionItemCount = (conv.actionItems ?? []).filter((a) => !a.completed).length;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: conv.status === "recording" ? colors.error : colors.border,
          borderWidth: conv.status === "recording" ? 1.5 : 0.5,
        },
      ]}
      activeOpacity={0.7}
      onPress={() => router.push(`/conversation/${conv.id}`)}
    >
      {conv.status === "recording" && (
        <View style={styles.recordingBanner}>
          <WaveformBars isActive barCount={12} color={colors.error} height={24} compact />
          <Text style={[styles.recordingText, { color: colors.error }]}>
            Live Recording
          </Text>
        </View>
      )}

      <View style={styles.row}>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {conv.title}
            </Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.gray500 }]} numberOfLines={1}>
            {conv.subtitle}
          </Text>

          <View style={styles.meta}>
            <Text style={[styles.metaText, { color: colors.gray400 }]}>
              {conv.dateShort} · {conv.duration}
            </Text>
            {conv.wordCount && conv.wordCount > 0 ? (
              <Text style={[styles.metaText, { color: colors.gray400 }]}>
                {conv.wordCount.toLocaleString()} words
              </Text>
            ) : null}
          </View>

          <View style={styles.footer}>
            <View style={styles.speakers}>
              {conv.speakers.slice(0, 3).map((s, idx) => (
                <View
                  key={s.id}
                  style={[styles.speakerAvatar, { marginLeft: idx > 0 ? -10 : 0 }]}
                >
                  <Avatar initials={s.initials} color={s.color} size={22} />
                </View>
              ))}
              {conv.speakers.length > 3 && (
                <View
                  style={[
                    styles.speakerMore,
                    { backgroundColor: colors.secondary, marginLeft: -10 },
                  ]}
                >
                  <Text style={[styles.speakerMoreText, { color: colors.gray500 }]}>
                    +{conv.speakers.length - 3}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.badges}>
              <Badge
                label={statusLabel(conv.status)}
                variant={statusVariant(conv.status)}
                dot
              />
              {actionItemCount > 0 && (
                <Badge
                  label={`${actionItemCount} action${actionItemCount > 1 ? "s" : ""}`}
                  variant="primary"
                />
              )}
            </View>
          </View>
        </View>

        <Feather name="chevron-right" size={18} color={colors.gray300} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  recordingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recordingText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
  },
  meta: {
    flexDirection: "row",
    gap: 8,
  },
  metaText: {
    fontSize: 11,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  speakers: {
    flexDirection: "row",
    alignItems: "center",
  },
  speakerAvatar: {
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  speakerMore: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  speakerMoreText: {
    fontSize: 9,
    fontWeight: "600",
  },
  badges: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
});
