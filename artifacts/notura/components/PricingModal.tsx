import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GlassCard } from "@/components/GlassCard";
import { useColors } from "@/hooks/useColors";

interface PricingModalProps {
  visible: boolean;
  onClose: () => void;
}

const FREE_FEATURES = [
  "5 gravações/mês",
  "Resumos básicos de IA",
  "Extração de itens de ação",
  "Histórico de 7 dias",
];

const PRO_FEATURES = [
  "Gravações ilimitadas",
  "Resumos avançados de IA",
  "Identificação de voz",
  "Histórico ilimitado",
  "Todas as integrações",
  "Colaboração em equipe",
  "Exportar para Notion / Slack",
  "Suporte prioritário",
];

export function PricingModal({ visible, onClose }: PricingModalProps) {
  const colors = useColors();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.root, { backgroundColor: "#F9F5FF" }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.heading }]}>Seja Pro</Text>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: "rgba(175,82,222,0.08)" }]}
            onPress={onClose}
          >
            <Feather name="x" size={18} color={colors.bodyText} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={[styles.tagline, { color: colors.bodyText }]}>
            Aproveite ao máximo cada conversa
          </Text>

          <View style={styles.plans}>
            <GlassCard style={{ gap: 14 }}>
              <Text style={[styles.planName, { color: colors.bodyText }]}>Gratuito</Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: colors.heading }]}>R$0</Text>
                <Text style={[styles.period, { color: colors.bodyText }]}>/mês</Text>
              </View>
              <View style={styles.features}>
                {FREE_FEATURES.map((f) => (
                  <View key={f} style={styles.featureRow}>
                    <Feather name="check" size={14} color={colors.gray400} />
                    <Text style={[styles.featureText, { color: colors.bodyText }]}>{f}</Text>
                  </View>
                ))}
              </View>
              <View style={[styles.currentPill, { backgroundColor: "rgba(175,82,222,0.08)" }]}>
                <Text style={[styles.currentText, { color: colors.bodyText }]}>Plano atual</Text>
              </View>
            </GlassCard>

            <View
              style={[
                styles.proPlanCard,
                { backgroundColor: colors.primary },
                Platform.OS === "ios" && { shadowColor: "#7B2FBE", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20 },
                Platform.OS === "android" && { elevation: 8 },
              ]}
            >
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Mais popular</Text>
              </View>
              <Text style={[styles.planName, { color: "rgba(255,255,255,0.75)" }]}>Pro</Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: "#fff" }]}>R$99</Text>
                <Text style={[styles.period, { color: "rgba(255,255,255,0.7)" }]}>/mês</Text>
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
              Platform.OS === "ios" && { shadowColor: "#7B2FBE", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 14 },
            ]}
            activeOpacity={0.92}
          >
            <Feather name="zap" size={17} color="#fff" />
            <Text style={styles.upgradeBtnText}>Assinar Pro — R$99/mês</Text>
          </TouchableOpacity>

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
  proPlanCard: { borderRadius: 20, padding: 20, gap: 14 },
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
  upgradeBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 54, borderRadius: 9999 },
  upgradeBtnText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  footer: { fontSize: 12, textAlign: "center" },
});
