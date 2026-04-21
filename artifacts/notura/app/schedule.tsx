import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { GlassCard } from "@/components/GlassCard";
import { useColors } from "@/hooks/useColors";

const MONTH = "Maio 2026";
const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const WEEK_DATES = [
  { day: "Seg", date: 18 },
  { day: "Ter", date: 19 },
  { day: "Qua", date: 20 },
  { day: "Sex", date: 21, active: true },
  { day: "Qui", date: 22 },
  { day: "Sáb", date: 23 },
  { day: "Dom", date: 24 },
];

const TIMELINE = [
  {
    id: "t1",
    time: "09:00",
    title: "Sync da Equipe",
    end: "09:30",
    color: "#AF52DE",
    bg: "rgba(175,82,222,0.09)",
    border: "rgba(175,82,222,0.20)",
    speakers: [
      { initials: "HC", color: "#AF52DE" },
      { initials: "SK", color: "#34C759" },
      { initials: "ML", color: "#FF9500" },
    ],
    current: true,
  },
  {
    id: "t2",
    time: "11:00",
    title: "Revisão do Sprint — Produto",
    end: "12:00",
    color: "#2A4A52",
    bg: "rgba(42,74,82,0.07)",
    border: "rgba(42,74,82,0.18)",
    speakers: [
      { initials: "HC", color: "#AF52DE" },
      { initials: "AK", color: "#007AFF" },
    ],
    current: false,
  },
  {
    id: "t3",
    time: "14:00",
    title: "Demo para Cliente — Acme Corp",
    end: "15:00",
    color: "#AF52DE",
    bg: "rgba(175,82,222,0.09)",
    border: "rgba(175,82,222,0.20)",
    speakers: [
      { initials: "HC", color: "#AF52DE" },
      { initials: "TN", color: "#FF3B30" },
      { initials: "RJ", color: "#34C759" },
    ],
    current: false,
  },
  {
    id: "t4",
    time: "16:30",
    title: "1-on-1 com Sarah",
    end: "17:00",
    color: "#34C759",
    bg: "rgba(52,199,89,0.07)",
    border: "rgba(52,199,89,0.18)",
    speakers: [
      { initials: "HC", color: "#AF52DE" },
      { initials: "SK", color: "#34C759" },
    ],
    current: false,
  },
];

const OFF_TIMES = ["08:00", "10:00", "13:00", "15:30"];

export default function ScheduleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(21);

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 24;

  return (
    <View style={styles.root}>
      <View style={[styles.calendarContainer, { paddingTop: topPad }]}>
        <View style={styles.calHeader}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: "rgba(255,255,255,0.12)" }]}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.monthRow}>
            <TouchableOpacity style={styles.monthArrow}>
              <Feather name="chevron-left" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{MONTH}</Text>
            <TouchableOpacity style={styles.monthArrow}>
              <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: "rgba(255,255,255,0.12)" }]}
          >
            <Feather name="plus" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {WEEK_DATES.map((d) => (
            <TouchableOpacity
              key={d.date}
              style={styles.dayCol}
              onPress={() => setSelectedDate(d.date)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dayLabel, { color: d.date === selectedDate ? "#AF52DE" : "rgba(255,255,255,0.55)" }]}>
                {d.day}
              </Text>
              <View
                style={[
                  styles.dateDot,
                  d.date === selectedDate
                    ? { backgroundColor: "#AF52DE" }
                    : { backgroundColor: "transparent" },
                ]}
              >
                <Text
                  style={[
                    styles.dateNum,
                    d.date === selectedDate
                      ? { color: "#FFFFFF", fontWeight: "700" }
                      : { color: "rgba(255,255,255,0.85)" },
                  ]}
                >
                  {d.date}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.setReminderBtn} activeOpacity={0.88}>
          <Feather name="bell" size={16} color="#FFFFFF" />
          <Text style={styles.setReminderText}>Definir Lembrete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.timeline, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.dayHeading, { color: colors.heading }]}>Sexta-feira, 21</Text>
        <Text style={[styles.dayCount, { color: colors.bodyText }]}>{TIMELINE.length} reuniões agendadas</Text>

        <View style={styles.timelineBody}>
          {TIMELINE.map((item) => (
            <View key={item.id} style={styles.timelineRow}>
              <View style={styles.timeCol}>
                <Text style={[styles.timeText, { color: colors.bodyText }]}>{item.time}</Text>
                {item.current && (
                  <View style={[styles.nowDot, { backgroundColor: "#AF52DE" }]} />
                )}
              </View>
              <View style={styles.timelineConnector}>
                <View style={[styles.connectorLine, { backgroundColor: "rgba(175,82,222,0.15)" }]} />
                <View style={[styles.connectorDot, {
                  backgroundColor: item.current ? "#AF52DE" : "rgba(175,82,222,0.30)",
                  borderColor: item.current ? "#AF52DE" : "rgba(175,82,222,0.20)",
                }]} />
                <View style={[styles.connectorLine, { backgroundColor: "rgba(175,82,222,0.15)" }]} />
              </View>
              <TouchableOpacity
                style={[
                  styles.meetingCard,
                  {
                    backgroundColor: item.bg,
                    borderColor: item.border,
                    borderLeftColor: item.color,
                  },
                ]}
                activeOpacity={0.85}
              >
                <View style={styles.meetingCardTop}>
                  <Text style={[styles.meetingTitle, { color: colors.heading }]}>{item.title}</Text>
                  {item.current && (
                    <View style={[styles.nowPill, { backgroundColor: "rgba(175,82,222,0.15)" }]}>
                      <Text style={[styles.nowPillText, { color: "#AF52DE" }]}>Agora</Text>
                    </View>
                  )}
                </View>
                <View style={styles.meetingCardBottom}>
                  <Feather name="clock" size={11} color={colors.bodyText} />
                  <Text style={[styles.meetingTime, { color: colors.bodyText }]}>{item.time} – {item.end}</Text>
                  <View style={styles.speakerStack}>
                    {item.speakers.slice(0, 3).map((s, i) => (
                      <View key={i} style={{ marginLeft: i > 0 ? -6 : 0 }}>
                        <Avatar initials={s.initials} color={s.color} size={20} />
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}

          {OFF_TIMES.map((t) => (
            <View key={t} style={styles.timelineRow}>
              <View style={styles.timeCol}>
                <Text style={[styles.timeText, { color: colors.gray400 }]}>{t}</Text>
              </View>
              <View style={styles.timelineConnector}>
                <View style={[styles.connectorLine, { backgroundColor: "rgba(175,82,222,0.08)" }]} />
                <View style={[styles.connectorDotSmall, { backgroundColor: "rgba(175,82,222,0.15)" }]} />
                <View style={[styles.connectorLine, { backgroundColor: "rgba(175,82,222,0.08)" }]} />
              </View>
              <View style={styles.emptySlot}>
                <Text style={[styles.emptySlotText, { color: colors.gray400 }]}>Horário livre</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  calendarContainer: {
    backgroundColor: "#2A4A52",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  calHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 8 },
  backBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  monthRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  monthArrow: { padding: 4 },
  monthText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  dayCol: { alignItems: "center", gap: 6, flex: 1 },
  dayLabel: { fontSize: 11, fontWeight: "500" },
  dateDot: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  dateNum: { fontSize: 15 },
  setReminderBtn: {
    backgroundColor: "#AF52DE",
    height: 52,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  setReminderText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
  timeline: { paddingHorizontal: 20, paddingTop: 20, gap: 4 },
  dayHeading: { fontSize: 20, fontWeight: "700" },
  dayCount: { fontSize: 13 },
  timelineBody: { gap: 0, marginTop: 12 },
  timelineRow: { flexDirection: "row", alignItems: "stretch", gap: 12, minHeight: 72 },
  timeCol: { width: 44, alignItems: "flex-end", justifyContent: "center", gap: 4 },
  timeText: { fontSize: 11, fontWeight: "500" },
  nowDot: { width: 6, height: 6, borderRadius: 3 },
  timelineConnector: { width: 18, alignItems: "center" },
  connectorLine: { width: 1.5, flex: 1 },
  connectorDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, marginVertical: 2 },
  connectorDotSmall: { width: 8, height: 8, borderRadius: 4, marginVertical: 2 },
  meetingCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: 12,
    gap: 8,
    marginBottom: 10,
  },
  meetingCardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  meetingTitle: { fontSize: 14, fontWeight: "600", flex: 1 },
  nowPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9999 },
  nowPillText: { fontSize: 11, fontWeight: "600" },
  meetingCardBottom: { flexDirection: "row", alignItems: "center", gap: 6 },
  meetingTime: { fontSize: 11, flex: 1 },
  speakerStack: { flexDirection: "row" },
  emptySlot: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    marginBottom: 10,
  },
  emptySlotText: { fontSize: 12, fontStyle: "italic" },
});
