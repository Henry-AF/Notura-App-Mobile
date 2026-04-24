import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { GlassCard } from "@/components/GlassCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface PricingModalProps {
  visible: boolean;
  onClose: () => void;
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "R$0",
    period: "/mês",
    highlight: false,
    features: ["até 3 reuniões"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$59,90",
    period: "/mês",
    highlight: true,
    badge: "Mais popular",
    features: ["Até 30 reuniões"],
    cta: "Ir para checkout",
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "R$79,90",
    period: "/mês",
    highlight: false,
    features: ["Ilimitado"],
    cta: "Ir para checkout",
  },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

function getCheckoutUrl(planId: PlanId) {
  if (planId === "pro") {
    return process.env.EXPO_PUBLIC_PRO_CHECKOUT_URL;
  }

  if (planId === "platinum") {
    return process.env.EXPO_PUBLIC_PLATINUM_CHECKOUT_URL;
  }

  return null;
}

export function PricingModal({ visible, onClose }: PricingModalProps) {
  const colors = useColors();
  const { currentUser } = useApp();

  async function handlePlanAction(planId: PlanId, isCurrentPlan: boolean) {
    if (isCurrentPlan) {
      return;
    }

    const checkoutUrl = getCheckoutUrl(planId);

    if (typeof checkoutUrl !== "string" || checkoutUrl.trim().length === 0) {
      Alert.alert("Checkout indisponível", "Configure a URL do checkout desse plano para continuar.");
      return;
    }

    onClose();
    await WebBrowser.openBrowserAsync(checkoutUrl);
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.root, { backgroundColor: "#F9F5FF" }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.heading }]}>Planos</Text>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: "rgba(175,82,222,0.08)" }]}
            onPress={onClose}
          >
            <Feather name="x" size={18} color={colors.bodyText} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={[styles.tagline, { color: colors.bodyText }]}>
            Escolha o plano ideal para a sua rotina de reuniões
          </Text>

          <View style={styles.plans}>
            {PLANS.map((plan) => {
              const isCurrentPlan = currentUser.plan === plan.id;

              if (plan.highlight) {
                return (
                  <View
                    key={plan.id}
                    style={[
                      styles.highlightPlanCard,
                      { backgroundColor: colors.primary },
                      Platform.OS === "ios" && {
                        shadowColor: "#7B2FBE",
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.35,
                        shadowRadius: 20,
                      },
                      Platform.OS === "android" && { elevation: 8 },
                    ]}
                  >
                    {plan.badge ? (
                      <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>{plan.badge}</Text>
                      </View>
                    ) : null}
                    <Text style={[styles.planName, { color: "rgba(255,255,255,0.78)" }]}>{plan.name}</Text>
                    <View style={styles.priceRow}>
                      <Text style={[styles.price, { color: "#FFFFFF" }]}>{plan.price}</Text>
                      <Text style={[styles.period, { color: "rgba(255,255,255,0.72)" }]}>{plan.period}</Text>
                    </View>
                    <View style={styles.features}>
                      {plan.features.map((feature) => (
                        <View key={feature} style={styles.featureRow}>
                          <Feather name="check" size={14} color="rgba(255,255,255,0.92)" />
                          <Text style={[styles.featureText, { color: "rgba(255,255,255,0.92)" }]}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                    {isCurrentPlan ? (
                      <View style={[styles.currentPill, styles.currentPillOnHighlight]}>
                        <Text style={[styles.currentText, styles.currentTextOnHighlight]}>Plano atual</Text>
                      </View>
                    ) : null}
                    <TouchableOpacity
                      style={[
                        styles.planActionButton,
                        styles.planActionButtonOnHighlight,
                        isCurrentPlan && styles.planActionButtonDisabled,
                      ]}
                      activeOpacity={0.9}
                      disabled={isCurrentPlan}
                      onPress={() => {
                        void handlePlanAction(plan.id, isCurrentPlan);
                      }}
                    >
                      <Text style={[styles.planActionText, styles.planActionTextOnHighlight]}>
                        {isCurrentPlan ? "Plano atual" : plan.cta}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }

              return (
                <GlassCard key={plan.id} style={{ gap: 14 }}>
                  <Text style={[styles.planName, { color: colors.bodyText }]}>{plan.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: colors.heading }]}>{plan.price}</Text>
                    <Text style={[styles.period, { color: colors.bodyText }]}>{plan.period}</Text>
                  </View>
                  <View style={styles.features}>
                    {plan.features.map((feature) => (
                      <View key={feature} style={styles.featureRow}>
                        <Feather name="check" size={14} color={colors.gray400} />
                        <Text style={[styles.featureText, { color: colors.bodyText }]}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                  {isCurrentPlan ? (
                    <View style={[styles.currentPill, { backgroundColor: "rgba(175,82,222,0.08)" }]}>
                      <Text style={[styles.currentText, { color: colors.bodyText }]}>Plano atual</Text>
                    </View>
                  ) : null}
                  {plan.id !== "free" ? (
                    <TouchableOpacity
                      style={[
                        styles.planActionButton,
                        { backgroundColor: colors.primary },
                        isCurrentPlan && styles.planActionButtonDisabled,
                      ]}
                      activeOpacity={0.9}
                      disabled={isCurrentPlan}
                      onPress={() => {
                        void handlePlanAction(plan.id, isCurrentPlan);
                      }}
                    >
                      <Text style={styles.planActionText}>{isCurrentPlan ? "Plano atual" : plan.cta}</Text>
                    </TouchableOpacity>
                  ) : null}
                </GlassCard>
              );
            })}
          </View>

          <Text style={[styles.footer, { color: colors.gray400 }]}>
            Cancele quando quiser · Cobrança mensal · Pagamento seguro
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: Platform.OS === "web" ? 20 : 16, paddingBottom: 12 },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  closeBtn: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  body: { padding: 20, gap: 20 },
  tagline: { fontSize: 15, textAlign: "center" },
  plans: { gap: 14 },
  highlightPlanCard: { borderRadius: 20, padding: 20, gap: 14 },
  popularBadge: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  popularText: { fontSize: 11, fontWeight: "600", color: "#fff" },
  planName: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 },
  priceRow: { flexDirection: "row", alignItems: "flex-end", gap: 2 },
  price: { fontSize: 38, fontWeight: "700", letterSpacing: -1 },
  period: { fontSize: 14, marginBottom: 6 },
  features: { gap: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontSize: 14 },
  currentPill: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 9999 },
  currentText: { fontSize: 12, fontWeight: "500" },
  currentPillOnHighlight: { backgroundColor: "rgba(255,255,255,0.18)" },
  currentTextOnHighlight: { color: "#FFFFFF" },
  planActionButton: { minHeight: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  planActionButtonOnHighlight: { backgroundColor: "#FFFFFF" },
  planActionButtonDisabled: { opacity: 0.65 },
  planActionText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
  planActionTextOnHighlight: { color: "#7B2FBE" },
  footer: { fontSize: 12, textAlign: "center" },
});
