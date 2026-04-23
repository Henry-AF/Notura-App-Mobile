import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Badge } from "@/components/Badge";
import { useColors } from "@/hooks/useColors";

export type HomeRecentMeetingStatus =
  | "completed"
  | "processing"
  | "recording"
  | "failed";

export interface HomeRecentMeetingCardItem {
  id: string;
  title: string;
  status: HomeRecentMeetingStatus;
  duration: string;
}

interface HomeRecentMeetingCardProps {
  conversation: HomeRecentMeetingCardItem;
  relativeRecordedAt: string;
}

function statusVariant(status: HomeRecentMeetingStatus) {
  switch (status) {
    case "completed":
      return "success";
    case "processing":
      return "warning";
    case "recording":
    case "failed":
      return "error";
  }
}

function statusLabel(status: HomeRecentMeetingStatus) {
  switch (status) {
    case "completed":
      return "Concluída";
    case "processing":
      return "Processando";
    case "recording":
      return "Ao Vivo";
    case "failed":
      return "Falhou";
  }
}

export function HomeRecentMeetingCard({
  conversation,
  relativeRecordedAt,
}: HomeRecentMeetingCardProps) {
  const colors = useColors();
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/conversation/${conversation.id}`)}
      style={styles.touchable}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.primary,
          },
          Platform.OS === "ios" && styles.shadowIos,
          Platform.OS === "android" && styles.shadowAndroid,
          Platform.OS === "web" && styles.shadowWeb,
        ]}
      >
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.heading }]} numberOfLines={1}>
              {conversation.title}
            </Text>
            <Feather name="chevron-right" size={16} color={colors.gray400} />
          </View>

          <View style={styles.metaRow}>
            <Text style={[styles.recordedAt, { color: colors.bodyText }]} numberOfLines={1}>
              {relativeRecordedAt}
            </Text>
            <View style={[styles.dot, { backgroundColor: colors.gray300 }]} />
            <Text style={[styles.duration, { color: colors.gray500 }]} numberOfLines={1}>
              {conversation.duration}
            </Text>
          </View>

          <View style={styles.footer}>
            <Badge label={statusLabel(conversation.status)} variant={statusVariant(conversation.status)} dot />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 10,
  },
  card: {
    borderRadius: 18,
    borderWidth: 0.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  shadowIos: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  shadowAndroid: {
    elevation: 2,
  },
  shadowWeb: {
    boxShadow: "0 4px 12px rgba(175,82,222,0.08)",
  } as any,
  content: {
    gap: 7,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  recordedAt: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    flexShrink: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 999,
  },
  duration: {
    fontSize: 11,
    lineHeight: 15,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
