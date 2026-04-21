import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Share,
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

const TABS = ["Summary", "Transcript", "Actions", "Highlights"] as const;
type Tab = (typeof TABS)[number];

export default function ConversationDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { conversations, toggleActionItem, addHighlight, highlights } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("Summary");

  const conv = useMemo(
    () => conversations.find((c) => c.id === id),
    [conversations, id]
  );

  if (!conv) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.gray500 }]}>
          Conversation not found
        </Text>
      </View>
    );
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const convHighlights = (conv.highlights ?? []).concat(
    highlights.filter((h) => h.conversationId === id && !conv.highlights?.find((ch) => ch.id === h.id))
  );

  function handleShare() {
    Share.share({
      title: conv.title,
      message: `${conv.title}\n\nSummary: ${conv.summary}\n\nRecorded on ${conv.date} (${conv.duration})`,
    });
  }

  function handleHighlight(segId: string) {
    const seg = conv.transcript?.find((s) => s.id === segId);
    if (!seg) return;
    const h = {
      id: `h-${Date.now()}`,
      conversationId: conv.id,
      conversationTitle: conv.title,
      speakerName: seg.speakerName,
      speakerInitials: seg.speakerInitials,
      speakerColor: seg.speakerColor,
      text: seg.text,
      timeLabel: seg.timeLabel,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      tag: "Highlight",
    };
    addHighlight(h);
    Alert.alert("Saved", "Highlight added to your saved moments.");
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
            onPress={handleShare}
          >
            <Feather name="share-2" size={18} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
          >
            <Feather name="more-horizontal" size={18} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={[styles.convTitle, { color: colors.foreground }]}>
          {conv.title}
        </Text>
        <View style={styles.convMeta}>
          <Text style={[styles.metaText, { color: colors.gray500 }]}>
            {conv.date}
          </Text>
          <Text style={[styles.metaDot, { color: colors.gray300 }]}>·</Text>
          <Text style={[styles.metaText, { color: colors.gray500 }]}>
            {conv.duration}
          </Text>
          {conv.wordCount && conv.wordCount > 0 ? (
            <>
              <Text style={[styles.metaDot, { color: colors.gray300 }]}>·</Text>
              <Text style={[styles.metaText, { color: colors.gray500 }]}>
                {conv.wordCount.toLocaleString()} words
              </Text>
            </>
          ) : null}
        </View>
        <View style={styles.speakersRow}>
          {conv.speakers.map((sp, i) => (
            <View key={sp.id} style={styles.speakerChip}>
              <Avatar initials={sp.initials} color={sp.color} size={20} />
              <Text style={[styles.speakerChipName, { color: colors.gray700 }]}>
                {sp.name.split(" ")[0]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View
        style={[
          styles.tabBar,
          { borderBottomColor: colors.border },
        ]}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabBtn}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.primary : colors.gray400 },
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && (
              <View
                style={[styles.tabIndicator, { backgroundColor: colors.primary }]}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Summary" && (
          <View style={styles.tabContent}>
            {conv.status === "processing" ? (
              <View style={styles.processingBox}>
                <Feather name="loader" size={24} color={colors.warning} />
                <Text style={[styles.processingText, { color: colors.gray600 }]}>
                  AI is processing your recording...
                </Text>
              </View>
            ) : (
              <>
                <View
                  style={[
                    styles.summaryCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <View style={styles.summaryHeader}>
                    <View
                      style={[
                        styles.aiIcon,
                        { backgroundColor: colors.brandSubtle },
                      ]}
                    >
                      <Feather name="zap" size={13} color={colors.primary} />
                    </View>
                    <Text style={[styles.summaryTitle, { color: colors.foreground }]}>
                      AI Summary
                    </Text>
                  </View>
                  <Text style={[styles.summaryText, { color: colors.gray700 }]}>
                    {conv.summary}
                  </Text>
                </View>

                {conv.keyPoints && conv.keyPoints.length > 0 && (
                  <View
                    style={[
                      styles.keyPointsCard,
                      { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.kpTitle, { color: colors.foreground }]}>
                      Key points
                    </Text>
                    {conv.keyPoints.map((kp, i) => (
                      <View key={i} style={styles.kpRow}>
                        <View
                          style={[styles.kpDot, { backgroundColor: colors.primary }]}
                        />
                        <Text style={[styles.kpText, { color: colors.gray700 }]}>
                          {kp}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <View
                  style={[
                    styles.speakersCard,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <Text style={[styles.kpTitle, { color: colors.foreground }]}>
                    Participants
                  </Text>
                  {conv.speakers.map((sp) => (
                    <View key={sp.id} style={styles.speakerRow}>
                      <Avatar initials={sp.initials} color={sp.color} size={32} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.spName, { color: colors.foreground }]}>
                          {sp.name}
                        </Text>
                        <View style={styles.spBarRow}>
                          <View
                            style={[
                              styles.spBar,
                              { backgroundColor: colors.secondary },
                            ]}
                          >
                            <View
                              style={[
                                styles.spBarFill,
                                { width: `${sp.talkTimePercent}%` as any, backgroundColor: sp.color },
                              ]}
                            />
                          </View>
                          <Text style={[styles.spPct, { color: colors.gray500 }]}>
                            {sp.talkTimePercent}%
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {activeTab === "Transcript" && (
          <View style={styles.tabContent}>
            {(conv.transcript ?? []).length === 0 ? (
              <View style={styles.empty}>
                <Feather name="file-text" size={32} color={colors.gray300} />
                <Text style={[styles.emptyText, { color: colors.gray500 }]}>
                  {conv.status === "processing"
                    ? "Transcript is being processed..."
                    : "No transcript available"}
                </Text>
              </View>
            ) : (
              conv.transcript!.map((seg) => (
                <View key={seg.id} style={styles.segmentRow}>
                  <Avatar
                    initials={seg.speakerInitials}
                    color={seg.speakerColor}
                    size={30}
                  />
                  <View style={styles.segBody}>
                    <View style={styles.segHeader}>
                      <Text style={[styles.segName, { color: seg.speakerColor }]}>
                        {seg.speakerName}
                      </Text>
                      <Text style={[styles.segTime, { color: colors.gray400 }]}>
                        {seg.timeLabel}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleHighlight(seg.id)}
                        style={styles.highlightBtn}
                      >
                        <Feather name="bookmark" size={13} color={colors.gray300} />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={[
                        styles.segText,
                        { color: colors.gray700 },
                        seg.isHighlighted && {
                          backgroundColor: colors.primary + "14",
                          borderRadius: 6,
                          overflow: "hidden",
                        },
                      ]}
                    >
                      {seg.text}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === "Actions" && (
          <View style={styles.tabContent}>
            {(conv.actionItems ?? []).length === 0 ? (
              <View style={styles.empty}>
                <Feather name="check-square" size={32} color={colors.gray300} />
                <Text style={[styles.emptyText, { color: colors.gray500 }]}>
                  No action items detected
                </Text>
              </View>
            ) : (
              conv.actionItems!.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.actionRow,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    action.completed && { opacity: 0.5 },
                  ]}
                  onPress={() => toggleActionItem(conv.id, action.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: action.completed ? colors.success : colors.gray300,
                        backgroundColor: action.completed ? colors.success : "transparent",
                      },
                    ]}
                  >
                    {action.completed && (
                      <Feather name="check" size={12} color="#fff" />
                    )}
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text
                      style={[
                        styles.actionText,
                        { color: colors.foreground },
                        action.completed && { textDecorationLine: "line-through" },
                      ]}
                    >
                      {action.text}
                    </Text>
                    <View style={styles.actionMeta}>
                      <Avatar
                        initials={action.assigneeInitials}
                        color={action.assigneeColor}
                        size={16}
                      />
                      <Text style={[styles.actionAssignee, { color: colors.gray500 }]}>
                        {action.assignee}
                      </Text>
                      {action.dueDate && (
                        <>
                          <Text style={[styles.actionDot, { color: colors.gray300 }]}>
                            ·
                          </Text>
                          <Feather name="calendar" size={11} color={colors.gray400} />
                          <Text style={[styles.actionDue, { color: colors.gray400 }]}>
                            {action.dueDate}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                  <Badge
                    label={action.priority}
                    variant={
                      action.priority === "high"
                        ? "error"
                        : action.priority === "medium"
                        ? "warning"
                        : "default"
                    }
                  />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {activeTab === "Highlights" && (
          <View style={styles.tabContent}>
            {convHighlights.length === 0 ? (
              <View style={styles.empty}>
                <Feather name="bookmark" size={32} color={colors.gray300} />
                <Text style={[styles.emptyText, { color: colors.gray500 }]}>
                  No highlights yet
                </Text>
                <Text style={[styles.emptySub, { color: colors.gray400 }]}>
                  Bookmark key moments in the transcript
                </Text>
              </View>
            ) : (
              convHighlights.map((h) => (
                <View
                  key={h.id}
                  style={[
                    styles.highlightCard,
                    { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: h.speakerColor, borderLeftWidth: 3 },
                  ]}
                >
                  <View style={styles.hlHeader}>
                    <Avatar initials={h.speakerInitials} color={h.speakerColor} size={22} />
                    <Text style={[styles.hlSpeaker, { color: h.speakerColor }]}>
                      {h.speakerName}
                    </Text>
                    <Text style={[styles.hlTime, { color: colors.gray400 }]}>
                      {h.timeLabel}
                    </Text>
                    {h.tag && <Badge label={h.tag} variant="primary" />}
                  </View>
                  <Text style={[styles.hlText, { color: colors.gray700 }]}>
                    "{h.text}"
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
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  iconBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerActions: { flexDirection: "row", gap: 8 },
  titleSection: { paddingHorizontal: 20, gap: 8, marginBottom: 4 },
  convTitle: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  convMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12 },
  metaDot: { fontSize: 12 },
  speakersRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  speakerChip: { flexDirection: "row", alignItems: "center", gap: 5 },
  speakerChipName: { fontSize: 12 },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginTop: 4,
  },
  tabBtn: { flex: 1, alignItems: "center", paddingVertical: 12, position: "relative" },
  tabText: { fontSize: 13, fontWeight: "500" },
  tabIndicator: { position: "absolute", bottom: 0, left: "20%", right: "20%", height: 2, borderRadius: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  tabContent: { gap: 12 },
  processingBox: { alignItems: "center", gap: 12, paddingVertical: 32 },
  processingText: { fontSize: 14 },
  summaryCard: { borderRadius: 16, borderWidth: 0.5, padding: 16, gap: 10 },
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  aiIcon: { width: 24, height: 24, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  summaryTitle: { fontSize: 14, fontWeight: "600" },
  summaryText: { fontSize: 14, lineHeight: 22 },
  keyPointsCard: { borderRadius: 16, borderWidth: 0.5, padding: 16, gap: 10 },
  kpTitle: { fontSize: 14, fontWeight: "600" },
  kpRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  kpDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  kpText: { flex: 1, fontSize: 13, lineHeight: 20 },
  speakersCard: { borderRadius: 16, borderWidth: 0.5, padding: 16, gap: 12 },
  speakerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  spName: { fontSize: 13, fontWeight: "500", marginBottom: 4 },
  spBarRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  spBar: { flex: 1, height: 5, borderRadius: 3, overflow: "hidden" },
  spBarFill: { height: 5, borderRadius: 3 },
  spPct: { fontSize: 11, width: 28 },
  segmentRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  segBody: { flex: 1, gap: 4 },
  segHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  segName: { fontSize: 12, fontWeight: "600", flex: 1 },
  segTime: { fontSize: 11 },
  highlightBtn: { padding: 2 },
  segText: { fontSize: 14, lineHeight: 21, paddingVertical: 2, paddingHorizontal: 2 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: { fontSize: 14, fontWeight: "500", lineHeight: 20 },
  actionMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionAssignee: { fontSize: 11 },
  actionDot: { fontSize: 11 },
  actionDue: { fontSize: 11 },
  highlightCard: {
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 14,
    gap: 8,
  },
  hlHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  hlSpeaker: { fontSize: 12, fontWeight: "600", flex: 1 },
  hlTime: { fontSize: 11 },
  hlText: { fontSize: 13, lineHeight: 20, fontStyle: "italic" },
  empty: { alignItems: "center", paddingVertical: 48, gap: 8 },
  emptyText: { fontSize: 14, fontWeight: "500" },
  emptySub: { fontSize: 13 },
  notFound: { flex: 1, textAlign: "center", marginTop: 100 },
});
