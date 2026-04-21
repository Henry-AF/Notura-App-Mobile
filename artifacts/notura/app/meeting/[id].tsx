import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { TaskCard } from "@/components/TaskCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { MeetingStatus } from "@/lib/mockData";

type Tab = "Summary" | "Transcript" | "Tasks";

function statusVariant(s: MeetingStatus) {
  switch (s) {
    case "completed": return "success";
    case "processing": return "warning";
    case "failed": return "error";
  }
}

export default function MeetingDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { meetings, tasks, toggleTask } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("Summary");

  const meeting = useMemo(
    () => meetings.find((m) => m.id === id),
    [meetings, id]
  );

  const meetingTasks = useMemo(
    () => tasks.filter((t) => t.meetingId === id),
    [tasks, id]
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;

  if (!meeting) {
    return (
      <View
        style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}
      >
        <Text style={[styles.notFound, { color: colors.gray500 }]}>
          Meeting not found
        </Text>
      </View>
    );
  }

  const TABS: Tab[] = ["Summary", "Tasks", "Transcript"];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.brandSubtle }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Feather name="share-2" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
          >
            <Feather name="edit-2" size={16} color={colors.gray500} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.errorBg }]}
          >
            <Feather name="trash-2" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 : insets.bottom + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.meetingMeta}>
          <Text style={[styles.meetingTitle, { color: colors.foreground }]}>
            {meeting.title}
          </Text>
          <Text style={[styles.meetingSubtitle, { color: colors.gray500 }]}>
            {meeting.subtitle}
          </Text>

          <View style={styles.metaRow}>
            <Badge
              label={meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
              variant={statusVariant(meeting.status)}
              dot
            />
            <View style={styles.metaItem}>
              <Feather name="calendar" size={12} color={colors.gray400} />
              <Text style={[styles.metaText, { color: colors.gray500 }]}>
                {meeting.date}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="clock" size={12} color={colors.gray400} />
              <Text style={[styles.metaText, { color: colors.gray500 }]}>
                {meeting.duration}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="users" size={12} color={colors.gray400} />
              <Text style={[styles.metaText, { color: colors.gray500 }]}>
                {meeting.participants}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    activeTab === tab ? colors.primary : "transparent",
                  borderColor:
                    activeTab === tab ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab ? "#fff" : colors.gray600 },
                ]}
              >
                {tab}
                {tab === "Tasks" && meetingTasks.length > 0
                  ? ` (${meetingTasks.length})`
                  : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "Summary" && (
          <View
            style={[
              styles.contentCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {meeting.summary ? (
              <>
                <View style={styles.cardHeader}>
                  <Feather name="zap" size={16} color={colors.primary} />
                  <Text
                    style={[styles.cardTitle, { color: colors.foreground }]}
                  >
                    AI Summary
                  </Text>
                </View>
                <Text
                  style={[styles.summaryText, { color: colors.gray700 }]}
                >
                  {meeting.summary}
                </Text>
              </>
            ) : (
              <View style={styles.processingWrap}>
                <Feather name="loader" size={28} color={colors.warning} />
                <Text style={[styles.processingText, { color: colors.gray500 }]}>
                  {meeting.status === "processing"
                    ? "AI is processing this meeting..."
                    : "Summary not available for failed meetings."}
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "Tasks" && (
          <View style={styles.taskList}>
            {meetingTasks.length === 0 ? (
              <View
                style={[
                  styles.contentCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    alignItems: "center",
                  },
                ]}
              >
                <Feather name="check-square" size={28} color={colors.gray300} />
                <Text style={[styles.processingText, { color: colors.gray500 }]}>
                  No tasks extracted from this meeting
                </Text>
              </View>
            ) : (
              meetingTasks.map((t) => (
                <TaskCard key={t.id} task={t} onToggle={toggleTask} />
              ))
            )}
          </View>
        )}

        {activeTab === "Transcript" && (
          <View style={styles.transcriptList}>
            {(meeting.transcript ?? []).length === 0 ? (
              <View
                style={[
                  styles.contentCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    alignItems: "center",
                  },
                ]}
              >
                <Feather name="mic-off" size={28} color={colors.gray300} />
                <Text style={[styles.processingText, { color: colors.gray500 }]}>
                  Transcript not available
                </Text>
              </View>
            ) : (
              (meeting.transcript ?? []).map((seg, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.transcriptSegment,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.segHeader}>
                    <Avatar
                      initials={seg.speakerInitials}
                      color={colors.primary}
                      size={30}
                    />
                    <Text
                      style={[styles.segSpeaker, { color: colors.foreground }]}
                    >
                      {seg.speaker}
                    </Text>
                    <Text style={[styles.segTime, { color: colors.gray400 }]}>
                      {seg.time}
                    </Text>
                  </View>
                  <Text style={[styles.segText, { color: colors.gray700 }]}>
                    {seg.text}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  notFound: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
    paddingTop: 4,
  },
  meetingMeta: {
    gap: 6,
  },
  meetingTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  meetingSubtitle: {
    fontSize: 14,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
  },
  contentCard: {
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 18,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
  },
  processingWrap: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  processingText: {
    fontSize: 14,
    textAlign: "center",
  },
  taskList: {
    gap: 0,
  },
  transcriptList: {
    gap: 10,
  },
  transcriptSegment: {
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 14,
    gap: 8,
  },
  segHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  segSpeaker: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  segTime: {
    fontSize: 11,
  },
  segText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
