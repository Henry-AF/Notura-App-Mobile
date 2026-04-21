import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GlassBackground } from "@/components/GlassBackground";
import { GlassCard } from "@/components/GlassCard";
import { SearchBar } from "@/components/SearchBar";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { mockConversations } from "@/lib/mockData";

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const PROJECT_CARDS = [
  { id: "p1", title: "App Mobile", sub: "E-commerce", icon: "smartphone", date: "21 mai", progress: 56, color: "#9B59D0" },
  { id: "p2", title: "Dashboard", sub: "Principal", icon: "layout", date: "21 mai", progress: 46, color: "#AF52DE" },
  { id: "p3", title: "Marketing", sub: "Campanha", icon: "megaphone", date: "21 mai", progress: 87, color: "#7B2FBE" },
  { id: "p4", title: "UI/UX", sub: "Design", icon: "pen-tool", date: "21 mai", progress: 24, color: "#9B59D0" },
];

function ProjectCard({ card }: { card: typeof PROJECT_CARDS[0] }) {
  const colors = useColors();
  return (
    <GlassCard style={styles.projectCard} noPad>
      <View style={styles.projectInner}>
        <View style={styles.projectTop}>
          <Text style={[styles.projectDate, { color: colors.bodyText }]}>{card.date}</Text>
          <Feather name="more-horizontal" size={14} color={colors.gray400} />
        </View>
        <View style={[styles.projectIconWrap, { backgroundColor: "rgba(175,82,222,0.12)" }]}>
          <Feather name={card.icon as any} size={18} color={colors.primary} />
        </View>
        <Text style={[styles.projectTitle, { color: colors.heading }]}>{card.title}</Text>
        <Text style={[styles.projectSub, { color: colors.bodyText }]}>{card.sub}</Text>
        <Text style={[styles.progressLabel, { color: colors.bodyText }]}>Progresso</Text>
        <View style={[styles.progressTrack, { backgroundColor: "rgba(175,82,222,0.12)" }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${card.progress}%` as any, backgroundColor: card.color },
            ]}
          />
        </View>
        <Text style={[styles.progressPct, { color: colors.primary }]}>{card.progress}%</Text>
      </View>
    </GlassCard>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser, setPricingVisible } = useApp();
  const [query, setQuery] = React.useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 + 100 : insets.bottom + 110;

  return (
    <GlassBackground>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.menuBtn}>
            <View style={styles.menuLine} />
            <View style={[styles.menuLine, { width: 14 }]} />
          </TouchableOpacity>
          <Text style={[styles.screenTitle, { color: colors.heading }]}>Início</Text>
          <TouchableOpacity style={[styles.bellBtn, { backgroundColor: "rgba(175,82,222,0.08)" }]}>
            <Feather name="bell" size={18} color={colors.heading} />
          </TouchableOpacity>
        </View>

        <View style={styles.greeting}>
          <Text style={[styles.greetingName, { color: colors.heading }]}>
            Olá, {currentUser.name.split(" ")[0]}!
          </Text>
          <Text style={[styles.greetingSub, { color: colors.bodyText }]}>{saudacao()}</Text>
        </View>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar projetos..."
        />

        <GlassCard style={[styles.welcomeCard, { backgroundColor: "rgba(175,82,222,0.07)" }]}>
          <View style={styles.welcomeInner}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.welcomeTitle, { color: colors.heading }]}>Bem-vindo!</Text>
              <Text style={[styles.welcomeSub, { color: colors.bodyText }]}>
                Vamos gravar sua próxima reunião.
              </Text>
            </View>
            <View style={styles.welcomeIllustration}>
              <View style={[styles.illustCircle, { backgroundColor: "rgba(175,82,222,0.15)" }]}>
                <Feather name="mic" size={28} color={colors.primary} />
              </View>
            </View>
          </View>
        </GlassCard>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.heading }]}>Projetos em andamento</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.projectGrid}>
          {PROJECT_CARDS.map((card) => (
            <ProjectCard key={card.id} card={card} />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.heading }]}>Recentes</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        {mockConversations.slice(0, 3).map((conv) => (
          <TouchableOpacity
            key={conv.id}
            onPress={() => router.push(`/conversation/${conv.id}`)}
            activeOpacity={0.9}
          >
            <GlassCard style={styles.recentCard} noPad>
              <View style={styles.recentInner}>
                <View style={[styles.recentIcon, { backgroundColor: "rgba(175,82,222,0.10)" }]}>
                  <Feather name="file-text" size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.recentTitle, { color: colors.heading }]} numberOfLines={1}>
                    {conv.title}
                  </Text>
                  <Text style={[styles.recentSub, { color: colors.bodyText }]}>
                    {conv.dateShort} · {conv.duration}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: conv.status === "completed" ? "rgba(52,199,89,0.12)" : "rgba(255,149,0,0.12)" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: conv.status === "completed" ? "#34C759" : "#FF9500" },
                    ]}
                  >
                    {conv.status === "completed" ? "Concluído" : "Processando"}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, gap: 16 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuBtn: { gap: 4, padding: 4 },
  menuLine: { width: 20, height: 2, backgroundColor: "#2D0A5E", borderRadius: 1 },
  screenTitle: { fontSize: 17, fontWeight: "600" },
  bellBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  greeting: { gap: 2 },
  greetingName: { fontSize: 26, fontWeight: "600", letterSpacing: -0.5 },
  greetingSub: { fontSize: 14 },
  welcomeCard: { borderColor: "rgba(175,82,222,0.2)" },
  welcomeInner: { flexDirection: "row", alignItems: "center", gap: 16 },
  welcomeTitle: { fontSize: 17, fontWeight: "600", marginBottom: 4 },
  welcomeSub: { fontSize: 13, lineHeight: 19 },
  welcomeIllustration: { alignItems: "center", justifyContent: "center" },
  illustCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 17, fontWeight: "600" },
  seeAll: { fontSize: 14, fontWeight: "500" },
  projectGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  projectCard: { width: "47.5%", padding: 0 },
  projectInner: { padding: 14, gap: 5 },
  projectTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  projectDate: { fontSize: 11 },
  projectIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  projectTitle: { fontSize: 15, fontWeight: "500" },
  projectSub: { fontSize: 12 },
  progressLabel: { fontSize: 11, marginTop: 4 },
  progressTrack: { height: 5, borderRadius: 3, overflow: "hidden", marginTop: 2 },
  progressFill: { height: 5, borderRadius: 3 },
  progressPct: { fontSize: 12, fontWeight: "600", textAlign: "right" },
  recentCard: { marginBottom: 0 },
  recentInner: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  recentIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  recentTitle: { fontSize: 14, fontWeight: "500" },
  recentSub: { fontSize: 12, marginTop: 1 },
  statusPill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 9999 },
  statusText: { fontSize: 11, fontWeight: "500" },
});
