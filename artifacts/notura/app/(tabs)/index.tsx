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

import { ConversationCard } from "@/components/ConversationCard";
import { GlassCard } from "@/components/GlassCard";
import { SearchBar } from "@/components/SearchBar";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { mockStats } from "@/lib/mockData";

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const PROJECT_CARDS = [
  { id: "p1", title: "App Mobile", sub: "E-commerce", icon: "smartphone", date: "21 mai", progress: 56 },
  { id: "p2", title: "Dashboard", sub: "Principal", icon: "layout", date: "21 mai", progress: 46 },
  { id: "p3", title: "Marketing", sub: "Campanha", icon: "radio", date: "21 mai", progress: 87 },
  { id: "p4", title: "UI/UX", sub: "Design", icon: "pen-tool", date: "21 mai", progress: 24 },
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
        <Text style={[styles.greetingName, { color: colors.heading }]}>
          Olá, {currentUser.name.split(" ")[0]}!
        </Text>
        <Text style={[styles.greetingSub, { color: colors.bodyText }]}>{saudacao()}</Text>
      </View>

      <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar projetos, reuniões..." />

      <GlassCard style={{ backgroundColor: "rgba(175,82,222,0.07)", borderColor: "rgba(175,82,222,0.20)" }}>
        <View style={styles.welcomeInner}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.welcomeTitle, { color: colors.heading }]}>Bem-vindo!</Text>
            <Text style={[styles.welcomeSub, { color: colors.bodyText }]}>
              Vamos gravar sua próxima reunião.
            </Text>
          </View>
          <View style={[styles.illustCircle, { backgroundColor: "rgba(175,82,222,0.14)" }]}>
            <Feather name="mic" size={30} color={colors.primary} />
          </View>
        </View>
      </GlassCard>

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.heading }]}>Projetos em andamento</Text>
        <TouchableOpacity><Text style={[styles.seeAll, { color: colors.primary }]}>Ver tudo</Text></TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {PROJECT_CARDS.map((card) => (
          <GlassCard key={card.id} noPad style={styles.projectCard}>
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
                <View style={[styles.progressFill, { width: `${card.progress}%` as any }]} />
              </View>
              <Text style={[styles.progressPct, { color: colors.primary }]}>{card.progress}%</Text>
            </View>
          </GlassCard>
        ))}
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
  greeting: { gap: 3 },
  greetingName: { fontSize: 26, fontWeight: "600", letterSpacing: -0.5 },
  greetingSub: { fontSize: 14 },
  welcomeInner: { flexDirection: "row", alignItems: "center", gap: 16 },
  welcomeTitle: { fontSize: 17, fontWeight: "600" },
  welcomeSub: { fontSize: 13, lineHeight: 19 },
  illustCircle: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 17, fontWeight: "600" },
  seeAll: { fontSize: 14, fontWeight: "500" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  projectCard: { width: "47.5%" },
  projectInner: { padding: 14, gap: 5 },
  projectTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  projectDate: { fontSize: 11 },
  projectIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center", marginVertical: 6 },
  projectTitle: { fontSize: 15, fontWeight: "500" },
  projectSub: { fontSize: 12 },
  progressLabel: { fontSize: 11, marginTop: 6 },
  progressTrack: { height: 5, borderRadius: 3, overflow: "hidden", marginTop: 3 },
  progressFill: { height: 5, borderRadius: 3, backgroundColor: "#AF52DE" },
  progressPct: { fontSize: 13, fontWeight: "600", textAlign: "right", marginTop: 2 },
});
