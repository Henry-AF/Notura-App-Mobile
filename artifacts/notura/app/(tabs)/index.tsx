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
import Svg, { Circle, Ellipse, Line, Path, Rect } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CircularProgress } from "@/components/CircularProgress";
import { ConversationCard } from "@/components/ConversationCard";
import { GlassCard } from "@/components/GlassCard";
import { SearchBar } from "@/components/SearchBar";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function IllustrationDesk() {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80">
      <Ellipse cx="40" cy="72" rx="28" ry="4" fill="rgba(175,82,222,0.10)" />
      <Rect x="12" y="44" width="56" height="5" rx="2.5" fill="#2A4A52" />
      <Rect x="18" y="49" width="4" height="20" rx="2" fill="#2A4A52" />
      <Rect x="58" y="49" width="4" height="20" rx="2" fill="#2A4A52" />
      <Rect x="18" y="24" width="44" height="28" rx="6" fill="#FFFFFF" />
      <Rect x="22" y="28" width="36" height="20" rx="4" fill="rgba(175,82,222,0.12)" />
      <Rect x="26" y="32" width="20" height="2.5" rx="1.25" fill="#AF52DE" />
      <Rect x="26" y="37" width="14" height="2" rx="1" fill="rgba(175,82,222,0.35)" />
      <Rect x="26" y="41" width="10" height="2" rx="1" fill="rgba(175,82,222,0.25)" />
      <Circle cx="50" cy="14" r="12" fill="rgba(42,74,82,0.90)" />
      <Circle cx="50" cy="11" r="4" fill="rgba(255,255,255,0.5)" />
      <Path d="M44 22 Q50 18 56 22" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

function IllustrationBoard() {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80">
      <Rect x="10" y="14" width="60" height="48" rx="8" fill="#2A4A52" />
      <Rect x="18" y="22" width="24" height="16" rx="4" fill="rgba(175,82,222,0.50)" />
      <Rect x="46" y="22" width="16" height="16" rx="4" fill="rgba(255,255,255,0.15)" />
      <Rect x="18" y="42" width="16" height="12" rx="4" fill="rgba(255,255,255,0.15)" />
      <Rect x="38" y="42" width="24" height="12" rx="4" fill="rgba(175,82,222,0.35)" />
      <Line x1="40" y1="14" x2="40" y2="8" stroke="#2A4A52" strokeWidth="3" strokeLinecap="round" />
      <Circle cx="34" cy="66" r="5" fill="rgba(175,82,222,0.20)" />
      <Circle cx="46" cy="66" r="5" fill="rgba(175,82,222,0.20)" />
    </Svg>
  );
}

const PROJECT_CARDS = [
  { id: "p1", title: "App Mobile", sub: "E-commerce", icon: "smartphone", date: "21 mai", progress: 56, variant: "white" as const, illustration: "desk" },
  { id: "p2", title: "Dashboard", sub: "Principal", icon: "layout", date: "21 mai", progress: 46, variant: "tinted" as const, illustration: "board" },
  { id: "p3", title: "Marketing", sub: "Campanha", icon: "radio", date: "21 mai", progress: 87, variant: "tinted" as const, illustration: null },
  { id: "p4", title: "", sub: "", icon: "plus", date: "", progress: 0, variant: "dark" as const, illustration: null },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { conversations, currentUser, setPricingVisible } = useApp();
  const [query, setQuery] = useState("");

  const topPad = Platform.OS === "web" ? 20 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 + 100 : insets.bottom + 110;

  const recent = conversations.slice(0, 3);
  const heroProgress = 73;

  return (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingTop: topPad, paddingBottom: bottomPad }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn}>
          <View style={[styles.menuLine, { backgroundColor: colors.heading }]} />
          <View style={[styles.menuLine, { backgroundColor: colors.heading, width: 14 }]} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: colors.heading }]}>Início</Text>
        <TouchableOpacity
          style={[styles.bellBtn, { backgroundColor: "rgba(175,82,222,0.08)" }]}
          onPress={() => setPricingVisible(true)}
        >
          <Feather name="bell" size={18} color={colors.heading} />
        </TouchableOpacity>
      </View>

      <View style={styles.greeting}>
        <Text style={[styles.greetingLine, { color: colors.bodyText }]}>{saudacao()},</Text>
        <View style={styles.heroTitleRow}>
          <Text style={[styles.heroTitle, { color: colors.heading }]}>Vamos gravar suas{" "}</Text>
        </View>
        <Text style={[styles.heroTitleLine2]}>
          <Text style={[styles.heroTitleAccent]}>reuniões</Text>
          <Text style={[styles.heroTitle, { color: colors.heading }]}> hoje</Text>
        </Text>
      </View>

      <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar projetos, reuniões..." />

      <View
        style={[
          styles.heroCard,
          Platform.OS === "ios" && { shadowColor: "#2A4A52", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 18 },
          Platform.OS === "android" && { elevation: 6 },
          Platform.OS === "web" && { boxShadow: "0 6px 24px rgba(42,74,82,0.20)" } as any,
        ]}
      >
        <View style={styles.heroLeft}>
          <Text style={styles.heroCardTitle}>Seus projetos estão indo bem</Text>
          <Text style={styles.heroCardSub}>3 tarefas pendentes esta semana</Text>
          <TouchableOpacity style={styles.heroCtaBtn} onPress={() => router.push("/schedule" as any)}>
            <Text style={styles.heroCtaBtnText}>Ver tarefas</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroRight}>
          <View style={styles.progressRingWrap}>
            <CircularProgress
              size={76}
              strokeWidth={7}
              progress={heroProgress}
              color="#AF52DE"
              trackColor="rgba(255,255,255,0.18)"
            />
            <View style={styles.progressRingCenter}>
              <Text style={styles.progressPct}>{heroProgress}%</Text>
              <Text style={styles.progressLabel}>feito</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.quickRow}>
        <TouchableOpacity
          style={[styles.quickChip, { backgroundColor: "rgba(175,82,222,0.08)", borderColor: "rgba(175,82,222,0.15)", borderWidth: 1 }]}
          onPress={() => router.push("/schedule" as any)}
          activeOpacity={0.8}
        >
          <Feather name="calendar" size={14} color={colors.primary} />
          <Text style={[styles.quickChipText, { color: colors.primary }]}>Agenda de hoje</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickChip, { backgroundColor: "rgba(175,82,222,0.08)", borderColor: "rgba(175,82,222,0.15)", borderWidth: 1 }]}
          onPress={() => router.push("/highlights" as any)}
          activeOpacity={0.8}
        >
          <Feather name="bookmark" size={14} color={colors.primary} />
          <Text style={[styles.quickChipText, { color: colors.primary }]}>Destaques</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.quickChip, { backgroundColor: "rgba(175,82,222,0.08)", borderColor: "rgba(175,82,222,0.15)", borderWidth: 1 }]}
          activeOpacity={0.8}
        >
          <Feather name="zap" size={14} color={colors.primary} />
          <Text style={[styles.quickChipText, { color: colors.primary }]}>IA Insights</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.heading }]}>Projetos em andamento</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: colors.primary }]}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {PROJECT_CARDS.map((card) => {
          if (card.variant === "dark") {
            return (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.projectCard,
                  styles.darkCard,
                  Platform.OS === "ios" && { shadowColor: "#2A4A52", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.20, shadowRadius: 14 },
                  Platform.OS === "web" && { boxShadow: "0 4px 16px rgba(42,74,82,0.22)" } as any,
                ]}
                activeOpacity={0.85}
              >
                <Text style={styles.darkCardLabel}>Ver mais</Text>
                <Text style={styles.darkCardCount}>+5 projetos</Text>
                <View style={styles.darkCardArrow}>
                  <Feather name="arrow-right" size={14} color="rgba(255,255,255,0.7)" />
                </View>
              </TouchableOpacity>
            );
          }

          const bgColor = card.variant === "tinted" ? "rgba(175,82,222,0.07)" : "#FFFFFF";
          return (
            <View
              key={card.id}
              style={[
                styles.projectCard,
                {
                  backgroundColor: bgColor,
                  borderWidth: 1,
                  borderColor: "rgba(175,82,222,0.10)",
                  borderRadius: 20,
                  overflow: "hidden",
                },
                Platform.OS === "ios" && { shadowColor: "#AF52DE", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 },
              ]}
            >
              <View style={styles.projectInner}>
                <View style={styles.projectTop}>
                  <Text style={[styles.projectDate, { color: colors.bodyText }]}>{card.date}</Text>
                  <Feather name="more-horizontal" size={14} color={colors.gray400} />
                </View>
                {card.illustration === "desk" && (
                  <View style={styles.illustWrap}><IllustrationDesk /></View>
                )}
                {card.illustration === "board" && (
                  <View style={styles.illustWrap}><IllustrationBoard /></View>
                )}
                {!card.illustration && (
                  <View style={[styles.projectIconWrap, { backgroundColor: "rgba(175,82,222,0.12)" }]}>
                    <Feather name={card.icon as any} size={18} color={colors.primary} />
                  </View>
                )}
                <Text style={[styles.projectTitle, { color: colors.heading }]}>{card.title}</Text>
                <Text style={[styles.projectSub, { color: colors.bodyText }]}>{card.sub}</Text>
                <View style={[styles.progressTrack, { backgroundColor: "rgba(175,82,222,0.12)" }]}>
                  <View style={[styles.progressFill, { width: `${card.progress}%` as any }]} />
                </View>
                <Text style={[styles.progressPct, { color: colors.primary }]}>{card.progress}%</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.heading }]}>Recentes</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
          <Text style={[styles.seeAll, { color: colors.primary }]}>Ver tudo</Text>
        </TouchableOpacity>
      </View>

      {recent.map((c) => (
        <ConversationCard key={c.id} conversation={c} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, gap: 16 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  menuBtn: { gap: 4, padding: 4 },
  menuLine: { width: 20, height: 2, borderRadius: 1 },
  screenTitle: { fontSize: 17, fontWeight: "600" },
  bellBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  greeting: { gap: 2 },
  greetingLine: { fontSize: 16 },
  heroTitleRow: { flexDirection: "row" },
  heroTitle: { fontSize: 28, fontWeight: "800", letterSpacing: -0.6, lineHeight: 34 },
  heroTitleLine2: { fontSize: 28, fontWeight: "800", letterSpacing: -0.6, lineHeight: 34 },
  heroTitleAccent: { fontSize: 28, fontWeight: "800", letterSpacing: -0.6, lineHeight: 34, color: "#AF52DE" },
  heroCard: {
    backgroundColor: "#2A4A52",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  heroLeft: { flex: 1, gap: 6 },
  heroCardTitle: { fontSize: 17, fontWeight: "700", color: "#FFFFFF", lineHeight: 22 },
  heroCardSub: { fontSize: 13, color: "rgba(255,255,255,0.60)", lineHeight: 18 },
  heroCtaBtn: {
    marginTop: 8,
    backgroundColor: "#AF52DE",
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    height: 36,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCtaBtnText: { fontSize: 13, fontWeight: "600", color: "#FFFFFF" },
  heroRight: { paddingLeft: 12 },
  progressRingWrap: { position: "relative", alignItems: "center", justifyContent: "center" },
  progressRingCenter: { position: "absolute", alignItems: "center" },
  progressPct: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  progressLabel: { fontSize: 10, color: "rgba(255,255,255,0.60)" },
  quickRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  quickChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 9999 },
  quickChipText: { fontSize: 13, fontWeight: "500" },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 17, fontWeight: "700" },
  seeAll: { fontSize: 14, fontWeight: "500" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  projectCard: { width: "47.5%" },
  projectInner: { padding: 14, gap: 5 },
  projectTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  projectDate: { fontSize: 11 },
  illustWrap: { marginVertical: 6 },
  projectIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center", marginVertical: 6 },
  projectTitle: { fontSize: 15, fontWeight: "600" },
  projectSub: { fontSize: 12 },
  progressTrack: { height: 5, borderRadius: 3, overflow: "hidden", marginTop: 6 },
  progressFill: { height: 5, borderRadius: 3, backgroundColor: "#AF52DE" },
  progressPct: { fontSize: 13, fontWeight: "700", textAlign: "right", marginTop: 2 },
  darkCard: {
    backgroundColor: "#2A4A52",
    borderRadius: 20,
    padding: 16,
    justifyContent: "center",
    gap: 4,
    minHeight: 160,
  },
  darkCardLabel: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
  darkCardCount: { fontSize: 22, fontWeight: "800", color: "#AF52DE" },
  darkCardArrow: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
});
