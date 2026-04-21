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
  "5 meetings/month",
  "Basic AI summaries",
  "Task extraction",
  "7-day history",
];

const PRO_FEATURES = [
  "Unlimited meetings",
  "Advanced AI insights",
  "Task prioritization",
  "Unlimited history",
  "WhatsApp sharing",
  "Team collaboration",
  "API access",
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
      <SafeAreaView
        style={[styles.root, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Upgrade to Pro
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.gray500} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.tagline, { color: colors.gray500 }]}>
            Get the most out of every meeting
          </Text>

          <View style={styles.plans}>
            <View
              style={[
                styles.planCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.planName, { color: colors.gray600 }]}>
                Free
              </Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: colors.foreground }]}>
                  $0
                </Text>
                <Text style={[styles.period, { color: colors.gray500 }]}>
                  /month
                </Text>
              </View>
              <View style={styles.features}>
                {FREE_FEATURES.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="check" size={14} color={colors.gray400} />
                    <Text style={[styles.featureText, { color: colors.gray600 }]}>
                      {f}
                    </Text>
                  </View>
                ))}
              </View>
              <View
                style={[
                  styles.currentBadge,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Text style={[styles.currentText, { color: colors.gray600 }]}>
                  Current plan
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.planCard,
                styles.proPlan,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
            >
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
              <Text style={[styles.planName, { color: "rgba(255,255,255,0.7)" }]}>
                Pro
              </Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: "#fff" }]}>$19</Text>
                <Text style={[styles.period, { color: "rgba(255,255,255,0.7)" }]}>
                  /month
                </Text>
              </View>
              <View style={styles.features}>
                {PRO_FEATURES.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="check" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={[styles.featureText, { color: "rgba(255,255,255,0.9)" }]}>
                      {f}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.upgradeBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <Feather name="zap" size={18} color="#fff" />
            <Text style={styles.upgradeBtnText}>Upgrade to Pro</Text>
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
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "web" ? 67 : 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 20,
    gap: 20,
  },
  tagline: {
    fontSize: 15,
    textAlign: "center",
  },
  plans: {
    gap: 16,
  },
  planCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  proPlan: {
    shadowColor: "#5341CD",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    right: 20,
    backgroundColor: "#EF9F27",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  popularText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  planName: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  price: {
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1,
  },
  period: {
    fontSize: 14,
    marginBottom: 5,
  },
  features: {
    gap: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 13,
  },
  currentBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  currentText: {
    fontSize: 12,
    fontWeight: "500",
  },
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 9999,
  },
  upgradeBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
  },
});
