import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { GlassCard } from "@/components/GlassCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FOLDERS = [
  { id: "f1", name: "Reuniões de Produto", date: "10 Jan, 2024", count: 12 },
  { id: "f2", name: "Vendas & Demos", date: "02 Mar, 2024", count: 8 },
  { id: "f3", name: "Liderança", date: "18 Abr, 2024", count: 5 },
  { id: "f4", name: "Pessoal", date: "01 Jan, 2024", count: 3 },
];

const TEAM = [
  { id: "t1", name: "Revisão da Estratégia Q2", sub: "Produto · Engenharia · Design", status: "Ativo", speakers: [{ initials: "HC", color: "#9B59D0" }, { initials: "SK", color: "#AF52DE" }, { initials: "ML", color: "#7B2FBE" }] },
  { id: "t2", name: "Onboarding — Acme Corp", sub: "Vendas · Sucesso do Cliente", status: "Ativo", speakers: [{ initials: "HC", color: "#9B59D0" }, { initials: "AK", color: "#AF52DE" }] },
  { id: "t3", name: "Planejamento de Sprint", sub: "Engenharia · Design", status: "Concluído", speakers: [{ initials: "SK", color: "#AF52DE" }, { initials: "RJ", color: "#7B2FBE" }] },
  { id: "t4", name: "Revisão de Campanha", sub: "Marketing", status: "Ativo", speakers: [{ initials: "TN", color: "#9B59D0" }, { initials: "HC", color: "#AF52DE" }] },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, conversations, integrations, toggleIntegration, logout, setPricingVisible } = useApp();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [autoJoin, setAutoJoin] = useState(true);
  const [aiModel, setAiModel] = useState("GPT-4o");

  const topPad = Platform.OS === "web" ? 20 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 + 100 : insets.bottom + 110;

  const totalHours = conversations.reduce((acc, c) => {
    const parts = c.duration.split("h ");
    const hours = parseInt(parts[0]) || 0;
    const mins = parseInt(parts[1]) || 0;
    return acc + hours + mins / 60;
  }, 0);

  const totalActions = conversations.reduce((a, c) => a + (c.actionItems?.length ?? 0), 0);

  return (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingTop: topPad, paddingBottom: bottomPad }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <View style={{ width: 38 }} />
        <Text style={[styles.screenTitle, { color: colors.heading }]}>Perfil</Text>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: "rgba(175,82,222,0.08)" }]}>
          <Feather name="settings" size={18} color={colors.heading} />
        </TouchableOpacity>
      </View>

      <View style={[styles.profileHeader, { backgroundColor: colors.darkCard }]}>
        <View style={[styles.avatarRing]}>
          <View style={[styles.avatarCircle, { backgroundColor: "rgba(175,82,222,0.45)" }]}>
            <Text style={styles.avatarText}>{currentUser.initials}</Text>
          </View>
        </View>
        <Text style={styles.profileName}>{currentUser.name}</Text>
        <Text style={styles.profileRole}>
          {currentUser.plan === "pro" ? "Pro · Notura AI" : "Notura AI — Plano Gratuito"}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{conversations.length}</Text>
            <Text style={styles.statLabel}>Reuniões</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{Math.round(totalHours)}h</Text>
            <Text style={styles.statLabel}>Gravadas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{totalActions}</Text>
            <Text style={styles.statLabel}>Ações</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={() => setPricingVisible(true)}>
        <GlassCard noPad style={{ borderColor: "rgba(155,89,208,0.35)" }}>
          <View style={styles.rowInner}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(175,82,222,0.12)" }]}>
              <Feather name="zap" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.heading }]}>
                {currentUser.plan === "pro" ? "Plano Pro ativo" : "Atualizar para Pro"}
              </Text>
              <Text style={[styles.rowSub, { color: colors.bodyText }]}>
                {currentUser.plan === "pro" ? "Todos os recursos desbloqueados" : "Gravações ilimitadas + IA avançada"}
              </Text>
            </View>
            {currentUser.plan !== "pro" && (
              <View style={[styles.pill, { backgroundColor: colors.primary }]}>
                <Text style={styles.pillText}>Upgrade</Text>
              </View>
            )}
          </View>
        </GlassCard>
      </TouchableOpacity>

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.heading }]}>Pastas</Text>
        <TouchableOpacity><Text style={[styles.seeAll, { color: colors.primary }]}>Ver tudo</Text></TouchableOpacity>
      </View>

      <View style={styles.foldersRow}>
        {FOLDERS.slice(0, 2).map((f) => (
          <GlassCard key={f.id} noPad style={styles.folderCard}>
            <View style={styles.folderInner}>
              <View style={[styles.iconWrap, { backgroundColor: "rgba(175,82,222,0.10)" }]}>
                <Feather name="folder" size={22} color="#AF52DE" />
              </View>
              <Text style={[styles.folderName, { color: colors.heading }]} numberOfLines={2}>{f.name}</Text>
              <Text style={[styles.folderDate, { color: colors.bodyText }]}>Criado {f.date}</Text>
              <Text style={[styles.folderCount, { color: colors.gray400 }]}>{f.count} itens</Text>
            </View>
          </GlassCard>
        ))}
      </View>

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.heading }]}>Minha Equipe</Text>
        <TouchableOpacity><Text style={[styles.seeAll, { color: colors.primary }]}>Ver tudo</Text></TouchableOpacity>
      </View>

      {TEAM.map((item) => (
        <GlassCard key={item.id} noPad>
          <View style={styles.rowInner}>
            <View style={[styles.iconWrap, { backgroundColor: "rgba(175,82,222,0.10)" }]}>
              <Feather name="users" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.heading }]} numberOfLines={1}>{item.name}</Text>
              <Text style={[styles.rowSub, { color: colors.bodyText }]}>{item.sub}</Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 5 }}>
              <View style={[styles.statusPill, {
                backgroundColor: item.status === "Concluído" ? "rgba(52,199,89,0.12)" : "rgba(175,82,222,0.10)"
              }]}>
                <Text style={[styles.statusText, { color: item.status === "Concluído" ? "#34C759" : colors.primary }]}>
                  {item.status}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                {item.speakers.slice(0, 3).map((s, i) => (
                  <View key={i} style={{ marginLeft: i > 0 ? -6 : 0 }}>
                    <Avatar initials={s.initials} color={s.color} size={22} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </GlassCard>
      ))}

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.heading }]}>Integrações</Text>
      </View>

      {integrations.map((integration) => (
        <GlassCard key={integration.id} noPad>
          <View style={styles.rowInner}>
            <View style={[styles.iconWrap, { backgroundColor: integration.color + "18" }]}>
              <Feather name={integration.icon as any} size={18} color={integration.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.heading }]}>{integration.name}</Text>
              <Text style={[styles.rowSub, { color: colors.bodyText }]}>{integration.description}</Text>
            </View>
            <Switch
              value={integration.connected}
              onValueChange={() => toggleIntegration(integration.id)}
              trackColor={{ false: "rgba(175,82,222,0.15)", true: colors.primary + "80" }}
              thumbColor={integration.connected ? colors.primary : colors.gray300}
              ios_backgroundColor="rgba(175,82,222,0.12)"
            />
          </View>
        </GlassCard>
      ))}

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: colors.heading }]}>Preferências</Text>
      </View>

      <GlassCard noPad>
        <View style={styles.rowInner}>
          <View style={[styles.iconWrap, { backgroundColor: "rgba(175,82,222,0.10)" }]}>
            <Feather name="bell" size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.heading }]}>Notificações</Text>
            <Text style={[styles.rowSub, { color: colors.bodyText }]}>Quando o resumo estiver pronto</Text>
          </View>
          <Switch
            value={notifEnabled}
            onValueChange={setNotifEnabled}
            trackColor={{ false: "rgba(175,82,222,0.15)", true: colors.primary + "80" }}
            thumbColor={notifEnabled ? colors.primary : colors.gray300}
            ios_backgroundColor="rgba(175,82,222,0.12)"
          />
        </View>
      </GlassCard>

      <GlassCard noPad>
        <View style={styles.rowInner}>
          <View style={[styles.iconWrap, { backgroundColor: "rgba(175,82,222,0.10)" }]}>
            <Feather name="calendar" size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.heading }]}>Entrar automaticamente</Text>
            <Text style={[styles.rowSub, { color: colors.bodyText }]}>Gravar convites do calendário</Text>
          </View>
          <Switch
            value={autoJoin}
            onValueChange={setAutoJoin}
            trackColor={{ false: "rgba(175,82,222,0.15)", true: colors.primary + "80" }}
            thumbColor={autoJoin ? colors.primary : colors.gray300}
            ios_backgroundColor="rgba(175,82,222,0.12)"
          />
        </View>
      </GlassCard>

      <TouchableOpacity
        onPress={() => Alert.alert("Sair", "Tem certeza?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Sair", style: "destructive", onPress: logout },
        ])}
        activeOpacity={0.9}
      >
        <GlassCard noPad style={{ borderColor: "rgba(255,59,48,0.25)" }}>
          <View style={[styles.rowInner, { justifyContent: "center" }]}>
            <Feather name="log-out" size={16} color="#FF3B30" />
            <Text style={[styles.rowTitle, { color: "#FF3B30" }]}>Sair da conta</Text>
          </View>
        </GlassCard>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.gray400 }]}>Notura v2.0 · Criado com IA</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, gap: 12 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  screenTitle: { fontSize: 17, fontWeight: "600" },
  iconBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  profileHeader: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 6,
  },
  avatarRing: {
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.85)",
    borderRadius: 44,
    padding: 2,
    marginBottom: 6,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: "#FFFFFF" },
  profileName: { fontSize: 20, fontWeight: "700", color: "#FFFFFF" },
  profileRole: { fontSize: 13, color: "rgba(255,255,255,0.65)" },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    width: "100%",
  },
  statItem: { flex: 1, alignItems: "center", gap: 2 },
  statNum: { fontSize: 22, fontWeight: "700", color: "#FFFFFF" },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.65)" },
  statDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.18)" },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: "600" },
  seeAll: { fontSize: 14, fontWeight: "500" },
  foldersRow: { flexDirection: "row", gap: 12 },
  folderCard: { flex: 1, padding: 0 },
  folderInner: { padding: 14, gap: 4 },
  iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  folderName: { fontSize: 13, fontWeight: "600", marginTop: 4 },
  folderDate: { fontSize: 11 },
  folderCount: { fontSize: 11 },
  rowInner: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  rowTitle: { fontSize: 14, fontWeight: "500" },
  rowSub: { fontSize: 12, marginTop: 1 },
  pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 9999 },
  pillText: { fontSize: 12, fontWeight: "600", color: "#FFFFFF" },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9999 },
  statusText: { fontSize: 11, fontWeight: "500" },
  version: { fontSize: 12, textAlign: "center", marginTop: 8, marginBottom: 4 },
});
