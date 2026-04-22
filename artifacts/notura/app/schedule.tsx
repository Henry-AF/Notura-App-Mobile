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

// ─── Design tokens (mesmos da Home) ──────────────────────────────────────────
const PRIMARY    = "#AF52DE";
const DARK_HDR   = "#1A1A2E";
const WHITE      = "#FFFFFF";
const TEXT_PRI   = "#1A1A1A";
const TEXT_SEC   = "#6B6B6B";
const BG_PAGE    = "#F9F3FD";
const BORDER     = "#E5D6F5";

// ─── Dados mockados ───────────────────────────────────────────────────────────
const WEEKDAYS = [
  { label: "Seg", day: 18 },
  { label: "Ter", day: 19 },
  { label: "Qua", day: 20 },
  { label: "Sex", day: 21 },
  { label: "Qui", day: 22 },
  { label: "Sáb", day: 23 },
  { label: "Dom", day: 24 },
];

type AvatarDef = { initials: string; bg: string };

type Meeting = {
  id: string;
  title: string;
  timeLabel: string;   // ex: "09:00"
  timeRange: string;   // ex: "09:00 – 09:30"
  borderColor: string;
  bgColor: string;
  badge?: string;
  avatars: AvatarDef[];
};

const MEETINGS: Meeting[] = [
  {
    id: "m1",
    title: "Sync da Equipe",
    timeLabel: "09:00",
    timeRange: "09:00 – 09:30",
    borderColor: PRIMARY,
    bgColor: BG_PAGE,
    badge: "Agora",
    avatars: [
      { initials: "HC", bg: "#C7C2EF" },
      { initials: "SK", bg: "#FFD699" },
      { initials: "ML", bg: "#B8DDCA" },
    ],
  },
  {
    id: "m2",
    title: "Revisão do Sprint — Produto",
    timeLabel: "11:00",
    timeRange: "11:00 – 12:00",
    borderColor: "#34C759",
    bgColor: "#F0FAF4",
    avatars: [
      { initials: "HC", bg: "#C7C2EF" },
      { initials: "AK", bg: "#B8D9F4" },
    ],
  },
  {
    id: "m3",
    title: "Demo para Cliente — Acme Corp",
    timeLabel: "14:00",
    timeRange: "14:00 – 15:00",
    borderColor: "#FF9500",
    bgColor: "#FFF7EC",
    avatars: [
      { initials: "HC", bg: "#C7C2EF" },
      { initials: "TN", bg: "#B8DDCA" },
      { initials: "RU", bg: "#F4B8C8" },
    ],
  },
  {
    id: "m4",
    title: "1-on-1 com Sarah",
    timeLabel: "16:30",
    timeRange: "16:30 – 17:00",
    borderColor: "#34C759",
    bgColor: "#F0FAF4",
    avatars: [
      { initials: "HC", bg: "#C7C2EF" },
      { initials: "SK", bg: "#FFD699" },
    ],
  },
];

const FREE_SLOTS = ["08:00", "10:00", "13:00"];

// ─── Sub-componentes ──────────────────────────────────────────────────────────
function AvatarChip({ initials, bg }: AvatarDef) {
  return (
    <View style={[styles.avatar, { backgroundColor: bg }]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <View
      style={[
        styles.meetingCard,
        {
          backgroundColor: meeting.bgColor,
          borderLeftColor: meeting.borderColor,
        },
      ]}
    >
      <View style={styles.meetingTop}>
        <Text style={styles.meetingTitle} numberOfLines={1}>
          {meeting.title}
        </Text>
        {meeting.badge && (
          <View style={styles.badgeNow}>
            <Text style={styles.badgeNowText}>{meeting.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.meetingBottom}>
        <View style={styles.meetingTimeRow}>
          <Feather name="clock" size={12} color={TEXT_SEC} />
          <Text style={styles.meetingTime}>{meeting.timeRange}</Text>
        </View>
        <View style={styles.avatarRow}>
          {meeting.avatars.map((a) => (
            <AvatarChip key={a.initials + meeting.id} {...a} />
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── ScheduleScreen ───────────────────────────────────────────────────────────
export default function ScheduleScreen() {
  const insets  = useSafeAreaInsets();
  const router  = useRouter();
  const [selectedDay, setSelectedDay] = useState(21);

  const topPad    = Platform.OS === "web" ? 16 : insets.top;
  const bottomPad = Platform.OS === "web" ? 80  : insets.bottom + 24;

  return (
    <View style={styles.root}>
      {/* ── Header escuro ── */}
      <View style={[styles.darkHeader, { paddingTop: topPad }]}>
        {/* Navegação: voltar | mês | + */}
        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.navBtn}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={22} color={WHITE} />
          </TouchableOpacity>

          <View style={styles.monthRow}>
            <TouchableOpacity style={styles.navBtn} activeOpacity={0.7}>
              <Feather name="chevron-left" size={18} color={WHITE} />
            </TouchableOpacity>
            <Text style={styles.monthText}>Maio 2026</Text>
            <TouchableOpacity style={styles.navBtn} activeOpacity={0.7}>
              <Feather name="chevron-right" size={18} color={WHITE} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7}>
            <Feather name="plus" size={22} color={WHITE} />
          </TouchableOpacity>
        </View>

        {/* Strip de dias */}
        <View style={styles.weekStrip}>
          {WEEKDAYS.map((d) => {
            const active = d.day === selectedDay;
            return (
              <TouchableOpacity
                key={d.day}
                style={styles.dayBtn}
                onPress={() => setSelectedDay(d.day)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>
                  {d.label}
                </Text>
                <View style={[styles.dayCircle, active && styles.dayCircleActive]}>
                  <Text style={[styles.dayNum, active && styles.dayNumActive]}>
                    {d.day}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botão Definir Lembrete */}
        <TouchableOpacity style={styles.reminderBtn} activeOpacity={0.85}>
          <Feather name="bell" size={15} color={WHITE} style={{ marginRight: 8 }} />
          <Text style={styles.reminderText}>Definir Lembrete</Text>
        </TouchableOpacity>
      </View>

      {/* ── Conteúdo ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho do dia */}
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>Sexta-feira, 21</Text>
          <Text style={styles.dayCount}>4 reuniões agendadas</Text>
        </View>

        {/* Timeline: reuniões */}
        <View style={styles.timeline}>
          {MEETINGS.map((m) => (
            <View key={m.id} style={styles.timeRow}>
              {/* Hora + ponto ativo */}
              <View style={styles.timeCol}>
                <Text style={styles.timeLabelText}>{m.timeLabel}</Text>
                <View style={styles.activeDot} />
              </View>
              <MeetingCard meeting={m} />
            </View>
          ))}

          {/* Horários livres */}
          {FREE_SLOTS.map((slot) => (
            <View key={slot} style={styles.timeRow}>
              <View style={styles.timeCol}>
                <Text style={[styles.timeLabelText, styles.timeLabelFree]}>
                  {slot}
                </Text>
                <View style={styles.freeDot} />
              </View>
              <View style={styles.freeSlot}>
                <Text style={styles.freeText}>Horário livre</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WHITE,
  },

  // Header escuro
  darkHeader: {
    backgroundColor: DARK_HDR,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Linha nav: back | mês | plus
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "700",
    color: WHITE,
  },

  // Strip de dias
  weekStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  dayBtn: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "400",
    color: "rgba(255,255,255,0.55)",
  },
  dayLabelActive: {
    color: WHITE,
    fontWeight: "600",
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleActive: {
    backgroundColor: PRIMARY,
  },
  dayNum: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.65)",
  },
  dayNumActive: {
    color: WHITE,
    fontWeight: "700",
  },

  // Botão lembrete
  reminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  reminderText: {
    fontSize: 15,
    fontWeight: "600",
    color: WHITE,
  },

  // Content
  scrollView: {
    flex: 1,
    backgroundColor: WHITE,
  },
  dayHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRI,
  },
  dayCount: {
    fontSize: 13,
    fontWeight: "400",
    color: TEXT_SEC,
    marginTop: 2,
  },

  // Timeline
  timeline: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  timeCol: {
    width: 48,
    alignItems: "flex-end",
    paddingTop: 12,
    gap: 6,
  },
  timeLabelText: {
    fontSize: 12,
    fontWeight: "500",
    color: TEXT_SEC,
  },
  timeLabelFree: {
    color: "#C0C0C0",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
  },
  freeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },

  // Card de reunião
  meetingCard: {
    flex: 1,
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  meetingTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  meetingTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_PRI,
    lineHeight: 20,
  },
  badgeNow: {
    backgroundColor: "#FFF0D6",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeNowText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#CC7A00",
  },
  meetingBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  meetingTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  meetingTime: {
    fontSize: 12,
    fontWeight: "400",
    color: TEXT_SEC,
  },
  avatarRow: {
    flexDirection: "row",
    gap: -4,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: WHITE,
  },
  avatarText: {
    fontSize: 7,
    fontWeight: "700",
    color: "#343452",
    letterSpacing: 0.2,
  },

  // Horário livre
  freeSlot: {
    flex: 1,
    paddingTop: 12,
  },
  freeText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#C0C0C0",
    fontStyle: "italic",
  },
});

