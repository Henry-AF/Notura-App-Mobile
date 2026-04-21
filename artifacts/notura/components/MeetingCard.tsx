import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Badge } from "@/components/Badge";
import { useColors } from "@/hooks/useColors";
import type { Meeting, MeetingStatus } from "@/lib/mockData";

interface MeetingCardProps {
  meeting: Meeting;
  compact?: boolean;
}

function statusBadgeVariant(status: MeetingStatus) {
  switch (status) {
    case "completed":
      return "success";
    case "processing":
      return "warning";
    case "failed":
      return "error";
  }
}

function statusLabel(status: MeetingStatus) {
  switch (status) {
    case "completed":
      return "Completed";
    case "processing":
      return "Processing";
    case "failed":
      return "Failed";
  }
}

export function MeetingCard({ meeting, compact = false }: MeetingCardProps) {
  const colors = useColors();
  const router = useRouter();

  const dateDay = meeting.date.split(" ")[1]?.replace(",", "") ?? "";
  const dateMonth = meeting.date.split(" ")[0]?.slice(0, 3) ?? "";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.primary,
        },
      ]}
      activeOpacity={0.7}
      onPress={() => router.push(`/meeting/${meeting.id}`)}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.dateBlock,
            { backgroundColor: colors.brandSubtle },
          ]}
        >
          <Text style={[styles.dateDay, { color: colors.primary }]}>
            {dateDay}
          </Text>
          <Text style={[styles.dateMonth, { color: colors.gray500 }]}>
            {dateMonth}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {meeting.title}
            </Text>
            <Badge
              label={statusLabel(meeting.status)}
              variant={statusBadgeVariant(meeting.status)}
              dot
            />
          </View>
          <Text
            style={[styles.subtitle, { color: colors.gray500 }]}
            numberOfLines={1}
          >
            {meeting.subtitle}
          </Text>

          {!compact && (
            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <Feather
                  name="clock"
                  size={12}
                  color={colors.gray400}
                />
                <Text style={[styles.metaText, { color: colors.gray500 }]}>
                  {meeting.duration}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Feather
                  name="users"
                  size={12}
                  color={colors.gray400}
                />
                <Text style={[styles.metaText, { color: colors.gray500 }]}>
                  {meeting.participants} participants
                </Text>
              </View>
            </View>
          )}
        </View>

        <Feather name="chevron-right" size={18} color={colors.gray300} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 16,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateBlock: {
    width: 44,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: "600",
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
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
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
});
