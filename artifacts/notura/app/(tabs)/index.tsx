import { useRouter } from "expo-router";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppNavbar } from "@/components/AppNavbar";
import { CircularProgress } from "@/components/CircularProgress";
import { HomeRecentMeetingCard } from "@/components/HomeRecentMeetingCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { fetchHomeOverview } from "./home-api";

const PLAN_LIMITS = {
  free: 3,
  pro: 30,
  platinum: null,
} as const;

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Bom dia", emoji: "👋" };
  if (h < 18) return { text: "Boa tarde", emoji: "☀️" };
  return { text: "Boa noite", emoji: "🌙" };
}

function parseConversationMonthKey(dateLabel: string, dateShort: string) {
  const now = new Date();
  const monthMap: Record<string, number> = {
    jan: 0,
    fev: 1,
    mar: 2,
    abr: 3,
    mai: 4,
    jun: 5,
    jul: 6,
    ago: 7,
    set: 8,
    out: 9,
    nov: 10,
    dez: 11,
  };

  const normalizedShort = dateShort.trim().toLowerCase();
  if (normalizedShort === "hoje" || normalizedShort === "agora mesmo") {
    return `${now.getFullYear()}-${now.getMonth()}`;
  }

  const match = dateLabel
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(/(\d{1,2})\s+de?\s*([a-z]{3})\.?\s+de?\s*(\d{4})|(\d{1,2})\s+([a-z]{3})\s+(\d{4})/);

  if (!match) return null;

  const monthToken = match[2] ?? match[5];
  const yearToken = match[3] ?? match[6];
  const monthIndex = monthToken ? monthMap[monthToken] : undefined;
  if (monthIndex === undefined || !yearToken) return null;

  return `${Number(yearToken)}-${monthIndex}`;
}

function formatPlanLabel(plan: "free" | "pro" | "platinum") {
  return plan.toUpperCase();
}

interface HomeConversation {
  id: string;
  title: string;
  status: "completed" | "processing" | "failed";
  date: string;
  dateShort: string;
  recordedAt: string;
  duration: string;
}

function getConversationSortTime(conversation: HomeConversation) {
  if (conversation.recordedAt) {
    const timestamp = new Date(conversation.recordedAt).getTime();
    if (!Number.isNaN(timestamp)) return timestamp;
  }

  return 0;
}

function formatRelativeRecordedAt(recordedAt?: string) {
  if (!recordedAt) return "Hoje";

  const recordedTimestamp = new Date(recordedAt).getTime();
  if (Number.isNaN(recordedTimestamp)) return "Hoje";

  const diffInMinutes = Math.max(0, Math.floor((Date.now() - recordedTimestamp) / (60 * 1000)));

  if (diffInMinutes < 1) return "Agora mesmo";
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""} atrás`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hora${diffInHours > 1 ? "s" : ""} atrás`;
  }

  return "Hoje";
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateShort(createdAt: string) {
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) {
    return "Hoje";
  }

  if (isSameDay(created, new Date())) {
    return "Hoje";
  }

  return created.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function toDateLabel(createdAt: string) {
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) {
    return "";
  }

  return created.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser } = useApp();
  const homeOverviewQuery = useQuery({
    queryKey: ["home-overview"],
    queryFn: () => fetchHomeOverview(),
  });

  const conversations: HomeConversation[] = (homeOverviewQuery.data?.recentMeetings ?? []).map(
    (meeting) => ({
      id: meeting.id,
      title: meeting.title,
      status: meeting.status,
      date: toDateLabel(meeting.createdAt),
      dateShort: toDateShort(meeting.createdAt),
      recordedAt: meeting.createdAt,
      duration: meeting.duration,
    }),
  );

  const bottomPad = Platform.OS === "web" ? 34 + 100 : insets.bottom + 110;

  const recentCompletedMeetingsToday = conversations
    .filter(
      (conversation) =>
        conversation.status === "completed" &&
        conversation.dateShort.trim().toLowerCase() === "hoje"
    )
    .sort((left, right) => getConversationSortTime(right) - getConversationSortTime(left))
    .slice(0, 3);
  const firstNameBase =
    homeOverviewQuery.data && homeOverviewQuery.data.userName.trim().length > 0
      ? homeOverviewQuery.data.userName
      : currentUser.name;
  const firstName = firstNameBase.trim().split(/\s+/)[0] || firstNameBase;
  const greeting = saudacao();
  const meetingsProcessedToday =
    homeOverviewQuery.data?.todayCount ??
    conversations.filter(
      (conversation) => conversation.dateShort.trim().toLowerCase() === "hoje",
    ).length;
  const currentMonthKey = `${new Date().getFullYear()}-${new Date().getMonth()}`;
  const meetingsThisMonth =
    homeOverviewQuery.data?.meetingsThisMonth ??
    conversations.filter((conversation) => {
      return parseConversationMonthKey(conversation.date, conversation.dateShort) === currentMonthKey;
    }).length;
  const currentPlan = homeOverviewQuery.data?.plan ?? currentUser.plan;
  const currentPlanLimit = homeOverviewQuery.data?.monthlyLimit ?? PLAN_LIMITS[currentUser.plan];
  const planUsageProgress = currentPlanLimit
    ? Math.min(Math.round((meetingsThisMonth / currentPlanLimit) * 100), 100)
    : Math.min(Math.max(meetingsThisMonth * 8, 12), 100);
  const meetingsRemaining = currentPlanLimit === null ? null : Math.max(currentPlanLimit - meetingsThisMonth, 0);

  return (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
      showsVerticalScrollIndicator={false}
    >
      <AppNavbar title="Início" />
      <View style={styles.content}>

      <View style={styles.greeting}>
        <Text style={styles.greetingLine}>
          {greeting.text}, {firstName} {greeting.emoji}
        </Text>
        <Text style={[styles.greetingSubline, { color: colors.bodyText }]}>
          Sua inteligência processou{" "}
          <Text style={[styles.greetingSublineStrong, { color: colors.heading }]}>
            {meetingsProcessedToday} reuniões
          </Text>{" "}
          hoje.
        </Text>
      </View>

      <View
        style={[
          styles.heroCard,
          styles.sectionSpacingLg,
          Platform.OS === "ios" && { shadowColor: "#000000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
          Platform.OS === "android" && { elevation: 2 },
          Platform.OS === "web" && { boxShadow: "0 2px 8px rgba(0,0,0,0.04)" } as any,
        ]}
      >
        <View style={styles.heroLeft}>
          <View style={styles.heroPlanRow}>
            <Text style={styles.heroPlanLabel}>PLANO</Text>
            <View style={[styles.heroPlanPill, { backgroundColor: "rgba(94,76,235,0.10)" }]}>
              <Text style={[styles.heroPlanPillText, { color: colors.primary }]}>
                {formatPlanLabel(currentPlan)}
              </Text>
            </View>
          </View>
          <Text style={styles.heroCardTitle}>Uso do seu plano</Text>
          <Text style={styles.heroCardSub}>
            {currentPlanLimit === null
              ? `${meetingsThisMonth} reuniões processadas neste mês no plano ilimitado.`
              : `${meetingsRemaining} reuniões disponíveis de ${currentPlanLimit} no seu ciclo mensal.`}
          </Text>
          <TouchableOpacity style={styles.heroCtaBtn} onPress={() => router.push("/(tabs)/search")}>
            <Text style={styles.heroCtaBtnText}>
              Ver reuniões
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroRight}>
          <View style={styles.progressRingWrap}>
            <CircularProgress
              size={76}
              strokeWidth={7}
              progress={planUsageProgress}
              color="#5E4CEB"
              trackColor="rgba(94,76,235,0.14)"
            />
            <View style={styles.progressRingCenter}>
              <Text style={styles.progressPct}>{planUsageProgress}%</Text>
              <Text style={styles.progressLabel}>
                {currentPlanLimit === null ? "uso" : "do plano"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.sectionRow, styles.sectionSpacingLg]}>
        <Text style={[styles.sectionTitle, { color: colors.heading }]}>Reuniões Recentes</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentMeetingsList}>
        {homeOverviewQuery.isPending ? (
          <View style={[styles.emptyRecentState, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.emptyRecentStateText, { color: colors.bodyText }]}>
              Carregando reuniões...
            </Text>
          </View>
        ) : homeOverviewQuery.isError ? (
          <View style={[styles.emptyRecentState, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.emptyRecentStateText, { color: colors.bodyText }]}>
              Nao foi possivel carregar suas reuniões agora.
            </Text>
          </View>
        ) : recentCompletedMeetingsToday.length > 0 ? (
          recentCompletedMeetingsToday.map((conversation) => (
            <HomeRecentMeetingCard
              key={conversation.id}
              conversation={conversation}
              relativeRecordedAt={formatRelativeRecordedAt(conversation.recordedAt)}
            />
          ))
        ) : (
          <View style={[styles.emptyRecentState, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.emptyRecentStateText, { color: colors.bodyText }]}>
              Nenhuma reunião foi feita hoje.
            </Text>
          </View>
        )}
      </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {},
  content: { paddingHorizontal: 20, paddingTop: 6 },
  sectionSpacingSm: { marginTop: 10 },
  sectionSpacingMd: { marginTop: 14 },
  sectionSpacingLg: { marginTop: 24 },
  greeting: { gap: 6, marginTop: 4 },
  greetingLine: { fontSize: 34, fontWeight: "700", lineHeight: 41, color: "#1C1C1E", letterSpacing: -1.05 },
  greetingSubline: { fontSize: 13, lineHeight: 18 },
  greetingSublineStrong: { fontWeight: "700" },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  heroLeft: { flex: 1, gap: 8 },
  heroPlanRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  heroPlanLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.8, color: "rgba(28,28,30,0.48)" },
  heroPlanPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  heroPlanPillText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.4 },
  heroCardTitle: { fontSize: 17, fontWeight: "600", color: "#1C1C1E", lineHeight: 23, letterSpacing: -0.17 },
  heroCardSub: { fontSize: 13, color: "#6D6D72", lineHeight: 18 },
  heroCtaBtn: {
    marginTop: 8,
    backgroundColor: "#5E4CEB",
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    height: 38,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCtaBtnText: { fontSize: 13, fontWeight: "600", color: "#FFFFFF" },
  heroRight: { paddingLeft: 12 },
  progressRingWrap: { position: "relative", alignItems: "center", justifyContent: "center" },
  progressRingCenter: { position: "absolute", alignItems: "center" },
  progressPct: { fontSize: 16, fontWeight: "700", color: "#1C1C1E" },
  progressLabel: { fontSize: 10, color: "rgba(28,28,30,0.60)" },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 17, fontWeight: "700" },
  seeAll: { fontSize: 14, fontWeight: "500" },
  recentMeetingsList: { marginTop: 14 },
  emptyRecentState: {
    borderRadius: 18,
    borderWidth: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  emptyRecentStateText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
