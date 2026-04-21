import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  const [languageModel, setLanguageModel] = useState("GPT-4o");

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : insets.bottom + 100;

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.scroll, { paddingTop: topPad, paddingBottom: bottomPad }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>

      <LinearGradient
        colors={["#5341CD", "#3526A0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileCard}
      >
        <Avatar initials={currentUser.initials} color="rgba(255,255,255,0.25)" size={60} />
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{currentUser.name}</Text>
          <Text style={styles.profileEmail}>{currentUser.email}</Text>
        </View>
        <View style={styles.planChip}>
          <Text style={styles.planText}>Free Plan</Text>
        </View>
      </LinearGradient>

      <TouchableOpacity
        style={[styles.upgradeBanner, { backgroundColor: colors.card, borderColor: "#5341CD40" }]}
        onPress={() => setPricingVisible(true)}
        activeOpacity={0.8}
      >
        <View style={[styles.upgradeIcon, { backgroundColor: colors.brandSubtle }]}>
          <Feather name="zap" size={16} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.upgradeTitle, { color: colors.foreground }]}>
            Upgrade to Pro
          </Text>
          <Text style={[styles.upgradeSub, { color: colors.gray500 }]}>
            Unlimited recordings, speaker ID, integrations
          </Text>
        </View>
        <Feather name="arrow-right" size={18} color={colors.primary} />
      </TouchableOpacity>

      <Text style={[styles.sectionLabel, { color: colors.gray500 }]}>Integrations</Text>
      {integrations.map((integration) => (
        <View
          key={integration.id}
          style={[
            styles.integrationRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.integrationIcon,
              { backgroundColor: integration.color + "18" },
            ]}
          >
            <Feather name={integration.icon as any} size={18} color={integration.color} />
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
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={integration.connected ? colors.primary : colors.gray300}
          />
        </View>
      ))}

      <Text style={[styles.sectionLabel, { color: colors.gray500 }]}>Preferences</Text>
      {[
        { label: "Meeting notifications", sub: "Notify when AI summary is ready", value: notifEnabled, onChange: setNotifEnabled },
        { label: "Auto-join calendar meetings", sub: "Automatically record calendar invites", value: autoJoin, onChange: setAutoJoin },
      ].map((pref) => (
        <View
          key={pref.label}
          style={[
            styles.prefRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.prefLabel, { color: colors.foreground }]}>
              {pref.label}
            </Text>
            <Text style={[styles.prefSub, { color: colors.gray500 }]}>
              {pref.sub}
            </Text>
          </View>
          <Switch
            value={pref.value}
            onValueChange={pref.onChange}
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={pref.value ? colors.primary : colors.gray300}
          />
        </View>
      ))}

      <Text style={[styles.sectionLabel, { color: colors.gray500 }]}>AI Model</Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"].map((model) => (
          <TouchableOpacity
            key={model}
            style={[
              styles.modelRow,
              languageModel === model && { backgroundColor: colors.brandSubtle },
              { borderRadius: 10, padding: 10 },
            ]}
            onPress={() => setLanguageModel(model)}
          >
            <View
              style={[
                styles.modelDot,
                { borderColor: languageModel === model ? colors.primary : colors.border },
              ]}
            >
              {languageModel === model && (
                <View style={[styles.modelFill, { backgroundColor: colors.primary }]} />
              )}
            </View>
            <Text
              style={[
                styles.modelName,
                { color: languageModel === model ? colors.primary : colors.foreground, fontWeight: languageModel === model ? "600" : "400" },
              ]}
            >
              {model}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { color: colors.gray500 }]}>Account</Text>
      {[
        { icon: "user", label: "Edit profile" },
        { icon: "lock", label: "Privacy & security" },
        { icon: "hard-drive", label: "Storage & data" },
        { icon: "help-circle", label: "Help & support" },
      ].map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[
            styles.menuRow,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name={item.icon as any} size={18} color={colors.gray600} />
          <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
          <Feather name="chevron-right" size={16} color={colors.gray300} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.signOutBtn, { borderColor: colors.error + "40" }]}
        onPress={() => {
          Alert.alert("Sign out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign out", style: "destructive", onPress: logout },
          ]);
        }}
      >
        <Feather name="log-out" size={16} color={colors.error} />
        <Text style={[styles.signOutText, { color: colors.error }]}>Sign out</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.gray300 }]}>
        Notura v2.0.0 · Built with AI
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 12 },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 20,
    padding: 20,
  },
  profileName: { fontSize: 18, fontWeight: "700", color: "#fff" },
  profileEmail: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  planChip: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  planText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  upgradeBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  upgradeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  upgradeTitle: { fontSize: 14, fontWeight: "600" },
  upgradeSub: { fontSize: 12, marginTop: 1 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  integrationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 14,
  },
  integrationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  integrationName: { fontSize: 14, fontWeight: "500" },
  integrationDesc: { fontSize: 12, marginTop: 1 },
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 14,
  },
  prefLabel: { fontSize: 14, fontWeight: "500" },
  prefSub: { fontSize: 12, marginTop: 1 },
  card: {
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 6,
    gap: 2,
  },
  modelRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  modelDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  modelFill: { width: 8, height: 8, borderRadius: 4 },
  modelName: { fontSize: 14 },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 14,
  },
  menuLabel: { fontSize: 14, flex: 1 },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 9999,
    borderWidth: 1,
    paddingVertical: 14,
    marginTop: 8,
  },
  signOutText: { fontSize: 15, fontWeight: "600" },
  version: { fontSize: 12, textAlign: "center", marginTop: 4 },
});
