import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
import { Badge } from "@/components/Badge";
import { ConversationCard } from "@/components/ConversationCard";
import { WaveformBars } from "@/components/WaveformBars";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { mockStats } from "@/lib/mockData";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
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
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPad, paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.greeting, { color: colors.gray500 }]}>
              {greeting()},
            </Text>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {currentUser.name.split(" ")[0]}
            </Text>
          </View>
          <View style={styles.topRight}>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setPricingVisible(true)}
            >
              <Feather name="zap" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile")}
              activeOpacity={0.8}
            >
              <Avatar initials={currentUser.initials} color={colors.primary} size={40} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.recordCard]}
          activeOpacity={0.85}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/record");
          }}
        >
          <LinearGradient
            colors={["#5341CD", "#3526A0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.recordGradient}
          >
            <View style={styles.recordLeft}>
              <View style={styles.recordIconWrap}>
                <Feather name="mic" size={22} color="#fff" />
              </View>
              <View>
                <Text style={styles.recordTitle}>Start Recording</Text>
                <Text style={styles.recordSub}>
                  AI will transcribe in real-time
                </Text>
              </View>
            </View>
            <WaveformBars isActive barCount={14} color="rgba(255,255,255,0.6)" height={36} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          {[
            { label: "This week", value: mockStats.thisWeekConversations, unit: "convos", icon: "calendar" },
            { label: "Total time", value: "24h", unit: "recorded", icon: "clock" },
            { label: "Actions open", value: mockStats.openActionItems, unit: "pending", icon: "check-square" },
          ].map((s) => (
            <View
              key={s.label}
              style={[
                styles.statChip,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name={s.icon as any} size={14} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {s.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.gray500 }]}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.aiCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.aiHeader}>
            <View
              style={[
                styles.aiIconWrap,
                { backgroundColor: colors.brandSubtle },
              ]}
            >
              <Feather name="zap" size={14} color={colors.primary} />
            </View>
            <Text style={[styles.aiTitle, { color: colors.foreground }]}>
              Today's AI Digest
            </Text>
            <Badge label="New" variant="primary" />
          </View>
          <Text style={[styles.aiText, { color: colors.gray700 }]}>
            You have <Text style={{ fontWeight: "600", color: colors.foreground }}>6 open action items</Text> from this week's meetings. Your talk-to-listen ratio is{" "}
            <Text style={{ fontWeight: "600", color: colors.primary }}>42:58</Text> — you're listening more than average. Top topics: mobile, roadmap, Series B.
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/analytics")}>
            <Text style={[styles.aiLink, { color: colors.primary }]}>
              View full analytics →
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Recent
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/search")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: { fontSize: 13 },
  name: { fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  topRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  recordCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#5341CD",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  recordGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  recordLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  recordIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  recordTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  recordSub: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 10 },
  statChip: {
    flex: 1,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 12,
    gap: 4,
  },
  statValue: { fontSize: 20, fontWeight: "700", letterSpacing: -0.5 },
  statLabel: { fontSize: 10, textAlign: "center" },
  aiCard: {
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 16,
    gap: 10,
  },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  aiIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  aiTitle: { fontSize: 14, fontWeight: "600", flex: 1 },
  aiText: { fontSize: 13, lineHeight: 20 },
  aiLink: { fontSize: 13, fontWeight: "500" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 17, fontWeight: "600" },
  seeAll: { fontSize: 13, fontWeight: "500" },
});
