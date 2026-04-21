import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface PricingModalProps {
  visible: boolean;
  onClose: () => void;
}

const FREE_FEATURES = [
  "5 recordings/month",
  "Basic AI summaries",
  "Action item extraction",
  "7-day history",
];

const PRO_FEATURES = [
  "Unlimited recordings",
  "Advanced AI summaries",
  "Speaker identification",
  "Unlimited history",
  "All integrations",
  "Team collaboration",
  "Export to Notion / Slack",
  "Priority support",
];

export function PricingModal({ visible, onClose }: PricingModalProps) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Upgrade to Pro
          </Text>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.secondary }]}
            onPress={onClose}
          >
            <Feather name="x" size={18} color={colors.gray500} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.tagline, { color: colors.gray500 }]}>
            Get the most out of every conversation
          </Text>

          <View style={styles.plans}>
            <View
              style={[
                styles.planCard,
                { backgroundColor: colors.card },
                Platform.OS === "ios" && {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                },
                Platform.OS === "android" && { elevation: 2 },
              ]}
            >
              <Text style={[styles.planName, { color: colors.gray500 }]}>Free</Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: colors.foreground }]}>$0</Text>
                <Text style={[styles.period, { color: colors.gray500 }]}>/month</Text>
              </View>
              <View style={styles.features}>
                {FREE_FEATURES.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="check" size={14} color={colors.gray400} />
                    <Text style={[styles.featureText, { color: colors.gray600 }]}>{f}</Text>
                  </View>
                ))}
              </View>
              <View style={[styles.currentPill, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.currentText, { color: colors.gray500 }]}>Current plan</Text>
              </View>
            </View>

            <View
              style={[
                styles.planCard,
                styles.proPlan,
                { backgroundColor: colors.primary },
                Platform.OS === "ios" && {
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                },
                Platform.OS === "android" && { elevation: 8 },
              ]}
            >
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
              <Text style={[styles.planName, { color: "rgba(255,255,255,0.7)" }]}>Pro</Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: "#fff" }]}>$19</Text>
                <Text style={[styles.period, { color: "rgba(255,255,255,0.7)" }]}>/month</Text>
              </View>
              <View style={styles.features}>
                {PRO_FEATURES.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="check" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={[styles.featureText, { color: "rgba(255,255,255,0.9)" }]}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.upgradeBtn,
              { backgroundColor: colors.primary },
              Platform.OS === "ios" && {
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.28,
                shadowRadius: 14,
              },
            ]}
            activeOpacity={0.92}
          >
            <Feather name="zap" size={17} color="#fff" />
            <Text style={styles.upgradeBtnText}>Upgrade to Pro — $19/mo</Text>
          </TouchableOpacity>

          <Text style={[styles.footer, { color: colors.gray400 }]}>
            Cancel anytime · Billed monthly · Secure checkout
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "web" ? 20 : 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  closeBtn: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  body: { padding: 20, gap: 20 },
  tagline: { fontSize: 15, textAlign: "center" },
  plans: { gap: 14 },
  planCard: { borderRadius: 20, padding: 20, gap: 14 },
  proPlan: {},
  popularBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  popularText: { fontSize: 11, fontWeight: "600", color: "#fff" },
  planName: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 },
  priceRow: { flexDirection: "row", alignItems: "flex-end", gap: 2 },
  price: { fontSize: 38, fontWeight: "700", letterSpacing: -1 },
  period: { fontSize: 14, marginBottom: 6 },
  features: { gap: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontSize: 14 },
  currentPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  currentText: { fontSize: 12, fontWeight: "500" },
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 54,
    borderRadius: 9999,
  },
  upgradeBtnText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  footer: { fontSize: 12, textAlign: "center" },
});
