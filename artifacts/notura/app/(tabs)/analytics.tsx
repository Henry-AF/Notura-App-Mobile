import { Feather } from "@expo/vector-icons";
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
const MAX_HOURS = 3.5;

function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card },
        Platform.OS === "ios" && {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        Platform.OS === "android" && { elevation: 2 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<"week" | "month">("week");

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 100;

  const speakerList = Object.values(SPEAKERS);
  const talkRatio = mockStats.talkToListenRatio;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Analytics</Text>
        <View style={[styles.periodToggle, { backgroundColor: colors.secondary }]}>
          {(["week", "month"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodBtn,
                period === p && [styles.periodBtnActive, { backgroundColor: colors.card }],
              ]}
              onPress={() => setPeriod(p)}
            >
              <Text
                style={[
                  styles.periodText,
                  { color: period === p ? colors.foreground : colors.gray500 },
                ]}
              >
                {p === "week" ? "This week" : "Month"}
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
            { label: "Hours", value: period === "week" ? "8.3" : "24.2", icon: "clock", color: colors.success },
            { label: "Actions", value: period === "week" ? "12" : "38", icon: "check-square", color: colors.warning },
          ].map((kpi) => (
            <Card key={kpi.label} style={styles.kpiCard}>
              <View style={[styles.kpiIconWrap, { backgroundColor: kpi.color + "15" }]}>
                <Feather name={kpi.icon as any} size={15} color={kpi.color} />
              </View>
              <Text style={[styles.kpiValue, { color: colors.foreground }]}>{kpi.value}</Text>
              <Text style={[styles.kpiLabel, { color: colors.gray500 }]}>{kpi.label}</Text>
            </Card>
          ))}
        </View>

        <Card>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Recording activity</Text>
          <View style={styles.barChart}>
            {WEEK_DATA.map((d) => {
              const barH = d.hours === 0 ? 3 : Math.max((d.hours / MAX_HOURS) * 72, 6);
              const isToday = d.day === "Thu";
              return (
                <View key={d.day} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barH,
                          backgroundColor: isToday ? colors.primary : colors.secondary,
                          borderRadius: 4,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.barLabel,
                      {
                        color: isToday ? colors.primary : colors.gray400,
                        fontWeight: isToday ? "600" : "400",
                      },
                    ]}
                  >
                    {d.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Talk · Listen ratio
          </Text>
          <View style={styles.ratioSection}>
            <View style={[styles.ratioTrack, { backgroundColor: colors.secondary }]}>
              <View
                style={[
                  styles.ratioFill,
                  { width: `${talkRatio}%` as any, backgroundColor: colors.primary },
                ]}
              />
            </View>
            <View style={styles.ratioRow}>
              <View style={styles.ratioItem}>
                <View style={[styles.ratioDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.ratioLabel, { color: colors.gray600 }]}>
                  You talk {talkRatio}%
                </Text>
              </View>
              <View style={styles.ratioItem}>
                <View style={[styles.ratioDot, { backgroundColor: colors.secondary }]} />
                <Text style={[styles.ratioLabel, { color: colors.gray600 }]}>
                  Listen {100 - talkRatio}%
                </Text>
              </View>
            </View>
            <View style={[styles.insightRow, { backgroundColor: colors.successBg }]}>
              <Feather name="trending-up" size={13} color={colors.success} />
              <Text style={[styles.insightText, { color: colors.success }]}>
                Above average listener — keep it up!
              </Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Speakers</Text>
          <View style={styles.speakerList}>
            {speakerList.map((sp) => (
              <View key={sp.id} style={styles.speakerRow}>
                <Avatar initials={sp.initials} color={sp.color} size={36} />
                <View style={{ flex: 1 }}>
                  <View style={styles.speakerNameRow}>
                    <Text style={[styles.speakerName, { color: colors.foreground }]}>{sp.name}</Text>
                    <Text style={[styles.speakerPct, { color: colors.primary }]}>
                      {sp.talkTimePercent}%
                    </Text>
                  </View>
                  <View style={[styles.speakerTrack, { backgroundColor: colors.secondary }]}>
                    <View
                      style={[
                        styles.speakerFill,
                        { width: `${sp.talkTimePercent}%` as any, backgroundColor: sp.color },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Top topics</Text>
          <View style={styles.topicsWrap}>
            {mockStats.topTopics.map((topic, idx) => {
              const sizes = [20, 17, 15, 14, 13, 12];
              const opacities = [1, 0.85, 0.75, 0.65, 0.55, 0.50];
              return (
                <View
                  key={topic}
                  style={[styles.topicChip, { backgroundColor: colors.brandSubtle }]}
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
        </Card>

        <Card>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Action completion</Text>
          <View style={styles.completionRow}>
            <View style={styles.completionLeft}>
              <Text style={[styles.completionPct, { color: colors.foreground }]}>78%</Text>
              <Text style={[styles.completionSub, { color: colors.gray500 }]}>completed</Text>
            </View>
            <View style={{ flex: 1, gap: 10 }}>
              {[
                { label: "Completed", value: 29, color: colors.success },
                { label: "Open", value: 6, color: colors.warning },
                { label: "Overdue", value: 3, color: colors.error },
              ].map((s) => (
                <View key={s.label} style={styles.completionItem}>
                  <View style={[styles.completionDot, { backgroundColor: s.color }]} />
                  <Text style={[styles.completionItemLabel, { color: colors.gray600 }]}>
                    {s.label}
                  </Text>
                  <Text style={[styles.completionItemVal, { color: colors.foreground }]}>
                    {s.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  periodToggle: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
  },
  periodBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodBtnActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  periodText: { fontSize: 13, fontWeight: "500" },
  scroll: { paddingHorizontal: 20, gap: 14 },
  card: { borderRadius: 16, padding: 16, gap: 14 },
  kpiRow: { flexDirection: "row", gap: 10 },
  kpiCard: { flex: 1, alignItems: "center", gap: 5, paddingVertical: 16 },
  kpiIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  kpiValue: { fontSize: 22, fontWeight: "600", letterSpacing: -0.5 },
  kpiLabel: { fontSize: 11, textAlign: "center" },
  cardTitle: { fontSize: 15, fontWeight: "600" },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
    height: 90,
  },
  barCol: { flex: 1, alignItems: "center", gap: 6 },
  barTrack: { flex: 1, justifyContent: "flex-end", width: "100%" },
  bar: { width: "100%" },
  barLabel: { fontSize: 10 },
  ratioSection: { gap: 12 },
  ratioTrack: { height: 10, borderRadius: 5, overflow: "hidden" },
  ratioFill: { height: 10 },
  ratioRow: { flexDirection: "row", gap: 20 },
  ratioItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratioDot: { width: 8, height: 8, borderRadius: 4 },
  ratioLabel: { fontSize: 13 },
  insightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
  },
  insightText: { fontSize: 13, fontWeight: "500" },
  speakerList: { gap: 14 },
  speakerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  speakerNameRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  speakerName: { fontSize: 14, fontWeight: "500" },
  speakerPct: { fontSize: 14, fontWeight: "600" },
  speakerTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  speakerFill: { height: 6, borderRadius: 3 },
  topicsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  topicChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9999 },
  topicText: { fontWeight: "600" },
  completionRow: { flexDirection: "row", alignItems: "center", gap: 24 },
  completionLeft: { alignItems: "center" },
  completionPct: { fontSize: 36, fontWeight: "300", letterSpacing: -1 },
  completionSub: { fontSize: 12 },
  completionItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  completionDot: { width: 8, height: 8, borderRadius: 4 },
  completionItemLabel: { fontSize: 13, flex: 1 },
  completionItemVal: { fontSize: 15, fontWeight: "600" },
});
