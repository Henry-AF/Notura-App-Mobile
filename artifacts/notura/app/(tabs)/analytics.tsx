import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppNavbar } from "@/components/AppNavbar";
import { Avatar } from "@/components/Avatar";
import { GlassCard } from "@/components/GlassCard";
import { useColors } from "@/hooks/useColors";
import { SPEAKERS, mockStats } from "@/lib/mockData";

const WEEK_DATA = [
  { day: "Seg", hours: 0.5 },
  { day: "Ter", hours: 2.2 },
  { day: "Qua", hours: 1.0 },
  { day: "Qui", hours: 3.1 },
  { day: "Sex", hours: 1.5 },
  { day: "Sáb", hours: 0 },
  { day: "Dom", hours: 0 },
];
const MAX_HOURS = 3.5;

export default function AnalyticsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<"week" | "month">("week");

  const bottomPad = Platform.OS === "web" ? 34 + 100 : insets.bottom + 110;
  const speakerList = Object.values(SPEAKERS);
  const talkRatio = mockStats.talkToListenRatio;

  return (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
      showsVerticalScrollIndicator={false}
    >
      <AppNavbar title="Análises" />
      <View style={styles.content}>
      <View style={styles.periodRow}>
        <GlassCard noPad noShadow style={styles.periodToggle}>
          {(["week", "month"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && [styles.periodBtnActive, { backgroundColor: colors.primary }]]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, { color: period === p ? "#FFFFFF" : colors.bodyText }]}>
                {p === "week" ? "Esta semana" : "Mês"}
              </Text>
            </TouchableOpacity>
          ))}
        </GlassCard>
      </View>

      <View style={styles.kpiRow}>
        {[
          { label: "Conversas", value: period === "week" ? "5" : "18", icon: "calendar", color: colors.primary },
          { label: "Horas", value: period === "week" ? "8,3" : "24,2", icon: "clock", color: "#34C759" },
          { label: "Ações", value: period === "week" ? "12" : "38", icon: "check-square", color: "#FF9500" },
        ].map((kpi) => (
          <GlassCard key={kpi.label} noPad style={styles.kpiCard}>
            <View style={[styles.kpiIconWrap, { backgroundColor: kpi.color + "18" }]}>
              <Feather name={kpi.icon as any} size={15} color={kpi.color} />
            </View>
            <Text style={[styles.kpiValue, { color: colors.heading }]}>{kpi.value}</Text>
            <Text style={[styles.kpiLabel, { color: colors.bodyText }]}>{kpi.label}</Text>
          </GlassCard>
        ))}
      </View>

      <GlassCard style={{ gap: 14 }}>
        <Text style={[styles.cardTitle, { color: colors.heading }]}>Atividade de gravação</Text>
        <View style={styles.barChart}>
          {WEEK_DATA.map((d) => {
            const barH = d.hours === 0 ? 3 : Math.max((d.hours / MAX_HOURS) * 72, 6);
            const isToday = d.day === "Qui";
            return (
              <View key={d.day} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View style={[styles.bar, { height: barH, backgroundColor: isToday ? colors.primary : "rgba(175,82,222,0.15)" }]} />
                </View>
                <Text style={[styles.barLabel, { color: isToday ? colors.primary : colors.gray400, fontWeight: isToday ? "600" : "400" }]}>
                  {d.day}
                </Text>
              </View>
            );
          })}
        </View>
      </GlassCard>

      <GlassCard style={{ gap: 14 }}>
        <Text style={[styles.cardTitle, { color: colors.heading }]}>Razão fala · escuta</Text>
        <View style={[styles.ratioTrack, { backgroundColor: "rgba(175,82,222,0.12)" }]}>
          <View style={[styles.ratioFill, { width: `${talkRatio}%` as any, backgroundColor: colors.primary }]} />
        </View>
        <View style={styles.ratioRow}>
          <View style={styles.ratioItem}>
            <View style={[styles.ratioDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.ratioLabel, { color: colors.bodyText }]}>Você fala {talkRatio}%</Text>
          </View>
          <View style={styles.ratioItem}>
            <View style={[styles.ratioDot, { backgroundColor: "rgba(175,82,222,0.20)" }]} />
            <Text style={[styles.ratioLabel, { color: colors.bodyText }]}>Escuta {100 - talkRatio}%</Text>
          </View>
        </View>
        <View style={[styles.insightRow, { backgroundColor: "rgba(52,199,89,0.10)" }]}>
          <Feather name="trending-up" size={13} color="#34C759" />
          <Text style={[styles.insightText, { color: "#34C759" }]}>Acima da média em escuta — continue assim!</Text>
        </View>
      </GlassCard>

      <GlassCard style={{ gap: 14 }}>
        <Text style={[styles.cardTitle, { color: colors.heading }]}>Participantes</Text>
        {speakerList.map((sp) => (
          <View key={sp.id} style={styles.speakerRow}>
            <Avatar initials={sp.initials} color={sp.color} size={36} />
            <View style={{ flex: 1 }}>
              <View style={styles.speakerNameRow}>
                <Text style={[styles.speakerName, { color: colors.heading }]}>{sp.name}</Text>
                <Text style={[styles.speakerPct, { color: colors.primary }]}>{sp.talkTimePercent}%</Text>
              </View>
              <View style={[styles.speakerTrack, { backgroundColor: "rgba(175,82,222,0.12)" }]}>
                <View style={[styles.speakerFill, { width: `${sp.talkTimePercent}%` as any, backgroundColor: sp.color }]} />
              </View>
            </View>
          </View>
        ))}
      </GlassCard>

      <GlassCard style={{ gap: 14 }}>
        <Text style={[styles.cardTitle, { color: colors.heading }]}>Principais tópicos</Text>
        <View style={styles.topicsWrap}>
          {mockStats.topTopics.map((topic, idx) => {
            const sizes = [20, 17, 15, 14, 13, 12];
            const opacities = [1, 0.85, 0.75, 0.65, 0.55, 0.50];
            return (
              <View key={topic} style={[styles.topicChip, { backgroundColor: "rgba(175,82,222,0.08)" }]}>
                <Text style={[styles.topicText, { color: colors.primary, fontSize: sizes[idx] ?? 12, opacity: opacities[idx] ?? 0.5 }]}>
                  {topic}
                </Text>
              </View>
            );
          })}
        </View>
      </GlassCard>

      <GlassCard style={{ gap: 14 }}>
        <Text style={[styles.cardTitle, { color: colors.heading }]}>Conclusão de ações</Text>
        <View style={styles.completionRow}>
          <View style={styles.completionLeft}>
            <Text style={[styles.completionPct, { color: colors.heading }]}>78%</Text>
            <Text style={[styles.completionSub, { color: colors.bodyText }]}>concluídos</Text>
          </View>
          <View style={{ flex: 1, gap: 10 }}>
            {[
              { label: "Concluídos", value: 29, color: "#34C759" },
              { label: "Abertos", value: 6, color: "#FF9500" },
              { label: "Atrasados", value: 3, color: "#FF3B30" },
            ].map((s) => (
              <View key={s.label} style={styles.completionItem}>
                <View style={[styles.completionDot, { backgroundColor: s.color }]} />
                <Text style={[styles.completionItemLabel, { color: colors.bodyText }]}>{s.label}</Text>
                <Text style={[styles.completionItemVal, { color: colors.heading }]}>{s.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </GlassCard>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {},
  content: { paddingHorizontal: 20, gap: 14 },
  periodRow: { alignItems: "flex-end" },
  periodToggle: { flexDirection: "row", borderRadius: 12, padding: 3, gap: 0 },
  periodBtn: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9 },
  periodBtnActive: {},
  periodText: { fontSize: 13, fontWeight: "500" },
  kpiRow: { flexDirection: "row", gap: 10 },
  kpiCard: { flex: 1, alignItems: "center", gap: 5, paddingVertical: 16 },
  kpiIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  kpiValue: { fontSize: 22, fontWeight: "600", letterSpacing: -0.5 },
  kpiLabel: { fontSize: 11, textAlign: "center" },
  cardTitle: { fontSize: 15, fontWeight: "600" },
  barChart: { flexDirection: "row", alignItems: "flex-end", gap: 5, height: 90 },
  barCol: { flex: 1, alignItems: "center", gap: 6 },
  barTrack: { flex: 1, justifyContent: "flex-end", width: "100%" },
  bar: { width: "100%", borderRadius: 4 },
  barLabel: { fontSize: 10 },
  ratioTrack: { height: 10, borderRadius: 5, overflow: "hidden" },
  ratioFill: { height: 10 },
  ratioRow: { flexDirection: "row", gap: 20 },
  ratioItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratioDot: { width: 8, height: 8, borderRadius: 4 },
  ratioLabel: { fontSize: 13 },
  insightRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 10 },
  insightText: { fontSize: 13, fontWeight: "500" },
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
