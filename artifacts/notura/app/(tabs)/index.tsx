import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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

import { Avatar } from "@/components/Avatar";
import { ConversationCard } from "@/components/ConversationCard";
import { WaveformBars } from "@/components/WaveformBars";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { mockStats } from "@/lib/mockData";

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function StatChip({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statChip,
        { backgroundColor: colors.card },
        Platform.OS === "ios" && {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        Platform.OS === "android" && { elevation: 1 },
      ]}
    >
      <View style={[styles.statIconWrap, { backgroundColor: colors.brandSubtle }]}>
        <Feather name={icon as any} size={14} color={colors.primary} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.gray500 }]}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { conversations, currentUser, setPricingVisible } = useApp();

  const recent = useMemo(
    () => conversations.filter((c) => c.status !== "failed").slice(0, 4),
    [conversations]
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 100;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.greeting, { color: colors.gray500 }]}>{saudacao()},</Text>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {currentUser.name.split(" ")[0]}
            </Text>
          </View>
          <View style={styles.topRight}>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
              onPress={() => setPricingVisible(true)}
            >
              <Feather name="zap" size={17} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} activeOpacity={0.85}>
              <Avatar initials={currentUser.initials} color={colors.primary} size={38} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.recordBtn,
            { backgroundColor: colors.primary },
            Platform.OS === "ios" && {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.28,
              shadowRadius: 16,
            },
            Platform.OS === "android" && { elevation: 6 },
          ]}
          activeOpacity={0.95}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/record");
          }}
        >
          <View style={styles.recordLeft}>
            <View style={styles.recordIconWrap}>
              <Feather name="mic" size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.recordTitle}>Iniciar Gravação</Text>
              <Text style={styles.recordSub}>IA transcreve em tempo real</Text>
            </View>
          </View>
          <WaveformBars isActive barCount={12} color="rgba(255,255,255,0.55)" height={32} />
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <StatChip icon="calendar" value={mockStats.thisWeekConversations} label="Esta semana" />
          <StatChip icon="clock" value="24h" label="Gravado" />
          <StatChip icon="check-square" value={mockStats.openActionItems} label="Ações abertas" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recentes</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        {recent.map((c) => (
          <ConversationCard key={c.id} conversation={c} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 16 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  greeting: { fontSize: 13 },
  name: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  topRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  recordBtn: {
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  recordLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  recordIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  recordTitle: { fontSize: 16, fontWeight: "600", color: "#fff" },
  recordSub: { fontSize: 12, color: "rgba(255,255,255,0.72)", marginTop: 1 },
  statsRow: { flexDirection: "row", gap: 10 },
  statChip: {
    flex: 1,
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 5,
  },
  statIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 20, fontWeight: "600", letterSpacing: -0.5 },
  statLabel: { fontSize: 10, textAlign: "center" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "600" },
  seeAll: { fontSize: 14, fontWeight: "500" },
});
