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
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, integrations, toggleIntegration, logout, setPricingVisible } = useApp();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [autoJoin, setAutoJoin] = useState(true);
  const [aiModel, setAiModel] = useState("GPT-4o");

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 100;

  function cardShadow() {
    if (Platform.OS === "ios") {
      return { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12 };
    }
    return { elevation: 1 };
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Perfil</Text>

      <View style={[styles.profileCard, { backgroundColor: colors.card, ...cardShadow() }]}>
        <Avatar initials={currentUser.initials} color={colors.primary} size={58} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.profileName, { color: colors.foreground }]}>{currentUser.name}</Text>
          <Text style={[styles.profileEmail, { color: colors.gray500 }]}>{currentUser.email}</Text>
        </View>
        <View style={[styles.planPill, { backgroundColor: colors.brandSubtle }]}>
          <Text style={[styles.planText, { color: colors.primary }]}>Gratuito</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.upgradeRow,
          { backgroundColor: colors.primary, ...cardShadow() },
          Platform.OS === "ios" && { shadowColor: colors.primary, shadowOpacity: 0.25 },
        ]}
        onPress={() => setPricingVisible(true)}
        activeOpacity={0.92}
      >
        <Feather name="zap" size={18} color="#fff" />
        <View style={{ flex: 1 }}>
          <Text style={styles.upgradeTitle}>Seja Pro</Text>
          <Text style={styles.upgradeSub}>Gravações ilimitadas · ID de fala · Integrações</Text>
        </View>
        <Feather name="arrow-right" size={16} color="rgba(255,255,255,0.8)" />
      </TouchableOpacity>

      <Text style={[styles.sectionHeader, { color: colors.gray500 }]}>INTEGRAÇÕES</Text>
      <View style={[styles.groupCard, { backgroundColor: colors.card, ...cardShadow() }]}>
        {integrations.map((integration, idx) => (
          <View key={integration.id}>
            <View style={styles.integrationRow}>
              <View style={[styles.integrationIcon, { backgroundColor: integration.color + "15" }]}>
                <Feather name={integration.icon as any} size={17} color={integration.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.integrationName, { color: colors.foreground }]}>
                  {integration.name}
                </Text>
                <Text style={[styles.integrationDesc, { color: colors.gray500 }]}>
                  {integration.description}
                </Text>
              </View>
              <Switch
                value={integration.connected}
                onValueChange={() => toggleIntegration(integration.id)}
                trackColor={{ false: colors.secondary, true: colors.primary + "60" }}
                thumbColor={integration.connected ? colors.primary : colors.gray300}
                ios_backgroundColor={colors.secondary}
              />
            </View>
            {idx < integrations.length - 1 && (
              <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 56 }]} />
            )}
          </View>
        ))}
      </View>

      <Text style={[styles.sectionHeader, { color: colors.gray500 }]}>PREFERÊNCIAS</Text>
      <View style={[styles.groupCard, { backgroundColor: colors.card, ...cardShadow() }]}>
        <View style={styles.prefRow}>
          <View style={[styles.prefIconWrap, { backgroundColor: colors.primary + "15" }]}>
            <Feather name="bell" size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.prefLabel, { color: colors.foreground }]}>Notificações</Text>
            <Text style={[styles.prefSub, { color: colors.gray500 }]}>Quando o resumo de IA estiver pronto</Text>
          </View>
          <Switch
            value={notifEnabled}
            onValueChange={setNotifEnabled}
            trackColor={{ false: colors.secondary, true: colors.primary + "60" }}
            thumbColor={notifEnabled ? colors.primary : colors.gray300}
            ios_backgroundColor={colors.secondary}
          />
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 56 }]} />
        <View style={styles.prefRow}>
          <View style={[styles.prefIconWrap, { backgroundColor: colors.success + "15" }]}>
            <Feather name="calendar" size={16} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.prefLabel, { color: colors.foreground }]}>Entrar reuniões automaticamente</Text>
            <Text style={[styles.prefSub, { color: colors.gray500 }]}>Gravar convites do calendário</Text>
          </View>
          <Switch
            value={autoJoin}
            onValueChange={setAutoJoin}
            trackColor={{ false: colors.secondary, true: colors.primary + "60" }}
            thumbColor={autoJoin ? colors.primary : colors.gray300}
            ios_backgroundColor={colors.secondary}
          />
        </View>
      </View>

      <Text style={[styles.sectionHeader, { color: colors.gray500 }]}>MODELO DE IA</Text>
      <View style={[styles.groupCard, { backgroundColor: colors.card, ...cardShadow() }]}>
        {["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"].map((model, idx) => (
          <View key={model}>
            <TouchableOpacity style={styles.modelRow} onPress={() => setAiModel(model)} activeOpacity={0.8}>
              <View style={[styles.radioOuter, { borderColor: model === aiModel ? colors.primary : colors.gray300 }]}>
                {model === aiModel && (
                  <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text
                style={[
                  styles.modelName,
                  { color: model === aiModel ? colors.primary : colors.foreground, fontWeight: model === aiModel ? "500" : "400" },
                ]}
              >
                {model}
              </Text>
            </TouchableOpacity>
            {idx < 2 && <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 42 }]} />}
          </View>
        ))}
      </View>

      <Text style={[styles.sectionHeader, { color: colors.gray500 }]}>CONTA</Text>
      <View style={[styles.groupCard, { backgroundColor: colors.card, ...cardShadow() }]}>
        {[
          { icon: "user", label: "Editar perfil", color: colors.info },
          { icon: "lock", label: "Privacidade", color: colors.warning },
          { icon: "hard-drive", label: "Armazenamento", color: colors.success },
          { icon: "help-circle", label: "Ajuda e suporte", color: colors.primary },
        ].map((item, idx) => (
          <View key={item.label}>
            <View style={styles.integrationRow}>
              <View style={[styles.integrationIcon, { backgroundColor: item.color + "15" }]}>
                <Feather name={item.icon as any} size={16} color={item.color} />
              </View>
              <Text style={[styles.integrationName, { color: colors.foreground }]}>{item.label}</Text>
              <Feather name="chevron-right" size={16} color={colors.gray300} />
            </View>
            {idx < 3 && <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 56 }]} />}
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.signOutRow, { backgroundColor: colors.card, ...cardShadow() }]}
        onPress={() =>
          Alert.alert("Sair", "Tem certeza que deseja sair?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: logout },
          ])
        }
        activeOpacity={0.97}
      >
        <View style={[styles.integrationIcon, { backgroundColor: colors.error + "12" }]}>
          <Feather name="log-out" size={16} color={colors.error} />
        </View>
        <Text style={[styles.signOutText, { color: colors.error }]}>Sair</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.gray400 }]}>Notura v2.0 · Criado com IA</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5, paddingHorizontal: 20, marginBottom: 16 },
  sectionHeader: { fontSize: 12, fontWeight: "600", letterSpacing: 0.6, paddingHorizontal: 20, marginTop: 24, marginBottom: 8 },
  profileCard: { marginHorizontal: 20, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  profileName: { fontSize: 17, fontWeight: "600" },
  profileEmail: { fontSize: 13, marginTop: 2 },
  planPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  planText: { fontSize: 12, fontWeight: "600" },
  upgradeRow: { marginHorizontal: 20, marginTop: 12, borderRadius: 16, flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  upgradeTitle: { fontSize: 15, fontWeight: "600", color: "#fff" },
  upgradeSub: { fontSize: 12, color: "rgba(255,255,255,0.72)", marginTop: 1 },
  groupCard: { marginHorizontal: 20, borderRadius: 16, overflow: "hidden" },
  integrationRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  integrationIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  integrationName: { fontSize: 15, fontWeight: "400", flex: 1 },
  integrationDesc: { fontSize: 12, marginTop: 1 },
  divider: { height: 0.5 },
  prefRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  prefIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  prefLabel: { fontSize: 15 },
  prefSub: { fontSize: 12, marginTop: 1 },
  modelRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  modelName: { fontSize: 15 },
  signOutRow: { marginHorizontal: 20, marginTop: 12, borderRadius: 16, flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  signOutText: { fontSize: 15, fontWeight: "500" },
  version: { fontSize: 12, textAlign: "center", marginTop: 20 },
});
