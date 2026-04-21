import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
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
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { SPEAKERS, mockStats } from "@/lib/mockData";

const WEEK_DATA = [
  { day: "Mon", hours: 0.5 },
  { day: "Tue", hours: 2.2 },
  { day: "Wed", hours: 1.0 },
  { day: "Thu", hours: 3.1 },
  { day: "Fri", hours: 1.5 },
  { day: "Sat", hours: 0 },
  { day: "Sun", hours: 0 },
];
const MAX_HOURS = 4;

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { conversations } = useApp();
  const [period, setPeriod] = useState<"week" | "month">("week");

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 100;

  const speakerList = Object.values(SPEAKERS);
  const myRatio = mockStats.talkToListenRatio;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Analytics</Text>
        <View style={styles.periodToggle}>
          {(["week", "month"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodBtn,
                { backgroundColor: period === p ? colors.primary : "transparent" },
              ]}
              onPress={() => setPeriod(p)}
            >
              <Text
                style={[
                  styles.periodText,
                  { color: period === p ? "#fff" : colors.gray500 },
                ]}
              >
                {p === "week" ? "This week" : "This month"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.kpiRow}>
          {[
            { label: "Conversations", value: period === "week" ? "5" : "18", icon: "calendar", color: colors.primary },
            { label: "Hours recorded", value: period === "week" ? "8.3h" : "24.2h", icon: "clock", color: colors.success },
            { label: "Action items", value: period === "week" ? "12" : "38", icon: "check-square", color: colors.warning },
          ].map((kpi) => (
            <View
              key={kpi.label}
              style={[
                styles.kpiCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.kpiIcon,
                  { backgroundColor: kpi.color + "18" },
                ]}
              >
                <Feather name={kpi.icon as any} size={16} color={kpi.color} />
              </View>
              <Text style={[styles.kpiValue, { color: colors.foreground }]}>
                {kpi.value}
              </Text>
              <Text style={[styles.kpiLabel, { color: colors.gray500 }]}>
                {kpi.label}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Recording activity
          </Text>
          <View style={styles.barChart}>
            {WEEK_DATA.map((d) => {
              const barH = d.hours === 0 ? 4 : Math.max((d.hours / MAX_HOURS) * 80, 8);
              const isToday = d.day === "Thu";
              return (
                <View key={d.day} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barH,
                          backgroundColor: isToday ? colors.primary : colors.brandSubtle,
                          borderRadius: 4,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.barLabel,
                      { color: isToday ? colors.primary : colors.gray400, fontWeight: isToday ? "600" : "400" },
                    ]}
                  >
                    {d.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Talk · Listen ratio
          </Text>
          <View style={styles.ratioSection}>
            <View style={styles.ratioBar}>
              <View
                style={[
                  styles.ratioFill,
                  { width: `${myRatio}%` as any, backgroundColor: colors.primary },
                ]}
              />
              <View
                style={[
                  styles.ratioFill,
                  { flex: 1, backgroundColor: colors.success },
                ]}
              />
            </View>
            <View style={styles.ratioLabels}>
              <View style={styles.ratioLabelItem}>
                <View style={[styles.ratioDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.ratioLabel, { color: colors.gray600 }]}>
                  You talk {myRatio}%
                </Text>
              </View>
              <View style={styles.ratioLabelItem}>
                <View style={[styles.ratioDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.ratioLabel, { color: colors.gray600 }]}>
                  Listen {100 - myRatio}%
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.ratioBadge,
                { backgroundColor: colors.successBg },
              ]}
            >
              <Feather name="trending-up" size={12} color={colors.success} />
              <Text style={[styles.ratioBadgeText, { color: colors.success }]}>
                Above average listener · Keep it up!
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Speaker breakdown
          </Text>
          <View style={styles.speakerList}>
            {speakerList.map((sp) => (
              <View key={sp.id} style={styles.speakerRow}>
                <Avatar initials={sp.initials} color={sp.color} size={36} />
                <View style={styles.speakerInfo}>
                  <View style={styles.speakerNameRow}>
                    <Text style={[styles.speakerName, { color: colors.foreground }]}>
                      {sp.name}
                    </Text>
                    <Text style={[styles.speakerPercent, { color: colors.primary }]}>
                      {sp.talkTimePercent}%
                    </Text>
                  </View>
                  <View style={styles.speakerTrack}>
                    <View
                      style={[
                        styles.speakerFill,
                        {
                          width: `${sp.talkTimePercent}%` as any,
                          backgroundColor: sp.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.speakerWords, { color: colors.gray500 }]}>
                    {sp.wordCount.toLocaleString()} words
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Top topics
          </Text>
          <View style={styles.topicsWrap}>
            {mockStats.topTopics.map((topic, idx) => {
              const sizes = [18, 16, 15, 14, 13, 12];
              const opacities = [1, 0.85, 0.7, 0.6, 0.55, 0.5];
              return (
                <View
                  key={topic}
                  style={[
                    styles.topicChip,
                    {
                      backgroundColor: colors.primary + "18",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.topicText,
                      {
                        color: colors.primary,
                        fontSize: sizes[idx] ?? 12,
                        opacity: opacities[idx] ?? 0.5,
                      },
                    ]}
                  >
                    {topic}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Action item completion
          </Text>
          <View style={styles.completionSection}>
            <View style={styles.completionArc}>
              <Text style={[styles.completionPct, { color: colors.foreground }]}>78%</Text>
              <Text style={[styles.completionSub, { color: colors.gray500 }]}>completed</Text>
            </View>
            <View style={styles.completionStats}>
              {[
                { label: "Completed", value: "29", color: colors.success },
                { label: "Open", value: "6", color: colors.warning },
                { label: "Overdue", value: "3", color: colors.error },
              ].map((s) => (
                <View key={s.label} style={styles.completionRow}>
                  <View style={[styles.completionDot, { backgroundColor: s.color }]} />
                  <Text style={[styles.completionLabel, { color: colors.gray600 }]}>
                    {s.label}
                  </Text>
                  <Text style={[styles.completionVal, { color: colors.foreground }]}>
                    {s.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
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
  periodToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(83,65,205,0.08)",
    borderRadius: 10,
    padding: 3,
    alignSelf: "flex-start",
  },
  periodBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodText: { fontSize: 13, fontWeight: "500" },
  scroll: { paddingHorizontal: 20, gap: 14 },
  kpiRow: { flexDirection: "row", gap: 10 },
  kpiCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 12,
    gap: 4,
    alignItems: "center",
  },
  kpiIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  kpiValue: { fontSize: 20, fontWeight: "700", letterSpacing: -0.5 },
  kpiLabel: { fontSize: 10, textAlign: "center" },
  card: {
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 16,
    gap: 14,
  },
  cardTitle: { fontSize: 15, fontWeight: "600" },
  barChart: { flexDirection: "row", alignItems: "flex-end", gap: 6, height: 100 },
  barCol: { flex: 1, alignItems: "center", gap: 6 },
  barTrack: { flex: 1, justifyContent: "flex-end", width: "100%" },
  bar: { width: "100%" },
  barLabel: { fontSize: 10 },
  ratioSection: { gap: 12 },
  ratioBar: {
    flexDirection: "row",
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  ratioFill: { height: 10 },
  ratioLabels: { flexDirection: "row", gap: 20 },
  ratioLabelItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratioDot: { width: 8, height: 8, borderRadius: 4 },
  ratioLabel: { fontSize: 13 },
  ratioBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: 10,
  },
  ratioBadgeText: { fontSize: 12, fontWeight: "500" },
  speakerList: { gap: 14 },
  speakerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  speakerInfo: { flex: 1, gap: 4 },
  speakerNameRow: { flexDirection: "row", justifyContent: "space-between" },
  speakerName: { fontSize: 14, fontWeight: "500" },
  speakerPercent: { fontSize: 14, fontWeight: "600" },
  speakerTrack: {
    height: 6,
    backgroundColor: "rgba(83,65,205,0.08)",
    borderRadius: 3,
    overflow: "hidden",
  },
  speakerFill: { height: 6, borderRadius: 3 },
  speakerWords: { fontSize: 11 },
  topicsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  topicChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  topicText: { fontWeight: "600" },
  completionSection: { flexDirection: "row", alignItems: "center", gap: 20 },
  completionArc: { alignItems: "center", gap: 2 },
  completionPct: { fontSize: 28, fontWeight: "700", letterSpacing: -1 },
  completionSub: { fontSize: 12 },
  completionStats: { flex: 1, gap: 10 },
  completionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  completionDot: { width: 8, height: 8, borderRadius: 4 },
  completionLabel: { fontSize: 13, flex: 1 },
  completionVal: { fontSize: 14, fontWeight: "600" },
});
