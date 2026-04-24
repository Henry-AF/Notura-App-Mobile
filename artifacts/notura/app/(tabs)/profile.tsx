import { Feather } from "@expo/vector-icons";
import React, { Fragment, useState } from "react";
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

import { AppNavbar } from "@/components/AppNavbar";
import { Avatar } from "@/components/Avatar";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function formatPlanLabel(plan: "free" | "pro" | "team") {
  if (plan === "team") return "Platinum";
  if (plan === "pro") return "Pro";
  return "Free";
}

function SectionHeader({
  title,
  subtitle,
  colors,
}: {
  title: string;
  subtitle?: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.heading }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.sectionSubtitle, { color: colors.bodyText }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

function SectionGroup({
  children,
  colors,
}: {
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  const items = React.Children.toArray(children);

  return (
    <View
      style={[
        styles.groupCard,
        {
          backgroundColor: "#FFFFFF",
          borderColor: colors.gray300,
          shadowColor: "#000000",
        },
      ]}
    >
      {items.map((child, index) => (
        <Fragment key={index}>
          {child}
          {index < items.length - 1 ? (
            <View style={[styles.groupDivider, { backgroundColor: colors.gray300 }]} />
          ) : null}
        </Fragment>
      ))}
    </View>
  );
}

function SettingsRow({
  icon,
  iconColor,
  iconBackground,
  title,
  subtitle,
  right,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  iconColor: string;
  iconBackground: string;
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.rowIconWrap, { backgroundColor: iconBackground }]}>
        <Feather name={icon} size={17} color={iconColor} />
      </View>
      <View style={styles.rowTextWrap}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {right}
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, conversations, logout, setPricingVisible } = useApp();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [autoJoin, setAutoJoin] = useState(true);

  const bottomPad = Platform.OS === "web" ? 124 : insets.bottom + 110;

  const totalHours = conversations.reduce((acc, conversation) => {
    const parts = conversation.duration.split("h ");
    const hours = parseInt(parts[0], 10) || 0;
    const mins = parseInt(parts[1], 10) || 0;
    return acc + hours + mins / 60;
  }, 0);

  const totalActions = conversations.reduce(
    (acc, conversation) => acc + (conversation.actionItems?.length ?? 0),
    0,
  );

  return (
    <ScrollView
      contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
      showsVerticalScrollIndicator={false}
    >
      <AppNavbar title="Perfil" showBackButton />

      <View style={styles.content}>
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: "#FFFFFF",
              borderColor: "rgba(0,0,0,0.05)",
              shadowColor: "#000000",
            },
          ]}
        >
          <View style={styles.heroTopRow}>
            <Avatar initials={currentUser.initials} color="#5E4CEB" size={64} />
            <View style={styles.heroIdentity}>
              <View
                style={[
                  styles.planBadge,
                  { backgroundColor: "rgba(94,76,235,0.10)" },
                ]}
              >
                <Text style={[styles.planBadgeText, { color: "#5E4CEB" }]}>
                  {formatPlanLabel(currentUser.plan)}
                </Text>
              </View>
              <Text style={[styles.profileName, { color: colors.heading }]}>
                {currentUser.name}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.bodyText }]}>
                {currentUser.email}
              </Text>
            </View>
          </View>

          <View style={[styles.statsPanel, { backgroundColor: "#F2F2F7" }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: colors.heading }]}>
                {conversations.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.gray600 }]}>
                Reunioes
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.gray300 }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: colors.heading }]}>
                {Math.round(totalHours)}h
              </Text>
              <Text style={[styles.statLabel, { color: colors.gray600 }]}>
                Gravadas
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.gray300 }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: colors.heading }]}>
                {totalActions}
              </Text>
              <Text style={[styles.statLabel, { color: colors.gray600 }]}>
                Acoes
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.92} onPress={() => setPricingVisible(true)}>
          <View
            style={[
              styles.planCard,
              {
                backgroundColor: "#FFFFFF",
                borderColor: "rgba(94,76,235,0.12)",
                shadowColor: "#000000",
              },
            ]}
          >
            <View style={[styles.planIconWrap, { backgroundColor: "rgba(94,76,235,0.10)" }]}>
              <Feather name="zap" size={18} color="#5E4CEB" />
            </View>
            <View style={styles.planCardTextWrap}>
              <Text style={[styles.planCardTitle, { color: colors.heading }]}>
                {currentUser.plan === "free" ? "Atualizar seu plano" : "Gerenciar assinatura"}
              </Text>
              <Text style={[styles.planCardSubtitle, { color: colors.bodyText }]}>
                {currentUser.plan === "free"
                  ? "Desbloqueie gravacoes ilimitadas e recursos premium."
                  : "Revise beneficios e detalhes da sua assinatura atual."}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.gray500} />
          </View>
        </TouchableOpacity>

        <SectionHeader
          title="Integracoes"
          subtitle="Conecte os canais essenciais para o seu fluxo."
          colors={colors}
        />
        <SectionGroup colors={colors}>
          <SettingsRow
            icon="message-circle"
            iconColor="#22C55E"
            iconBackground="rgba(34,197,94,0.12)"
            title="WhatsApp"
            subtitle="Envio de resumos e notificacoes por conversa."
            right={
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: "rgba(0,0,0,0.04)" },
                ]}
              >
                <Text style={[styles.statusBadgeText, { color: colors.gray600 }]}>
                  Em breve
                </Text>
              </View>
            }
          />
        </SectionGroup>

        <SectionHeader
          title="Preferencias"
          subtitle="Defina como o app participa da sua rotina."
          colors={colors}
        />
        <SectionGroup colors={colors}>
          <SettingsRow
            icon="bell"
            iconColor="#5E4CEB"
            iconBackground="rgba(94,76,235,0.10)"
            title="Notificacoes"
            subtitle="Avisar quando o resumo estiver pronto."
            right={
              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{ false: "#D1D1D6", true: "#8E7FF4" }}
                thumbColor={notifEnabled ? "#5E4CEB" : "#FFFFFF"}
                ios_backgroundColor="#D1D1D6"
              />
            }
          />
          <SettingsRow
            icon="calendar"
            iconColor="#5E4CEB"
            iconBackground="rgba(94,76,235,0.10)"
            title="Entrar automaticamente"
            subtitle="Gravar convites vindos do calendario."
            right={
              <Switch
                value={autoJoin}
                onValueChange={setAutoJoin}
                trackColor={{ false: "#D1D1D6", true: "#8E7FF4" }}
                thumbColor={autoJoin ? "#5E4CEB" : "#FFFFFF"}
                ios_backgroundColor="#D1D1D6"
              />
            }
          />
        </SectionGroup>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Sair", "Tem certeza?", [
              { text: "Cancelar", style: "cancel" },
              { text: "Sair", style: "destructive", onPress: logout },
            ])
          }
          activeOpacity={0.92}
        >
          <View
            style={[
              styles.logoutCard,
              {
                backgroundColor: "#FFFFFF",
                borderColor: "rgba(255,59,48,0.10)",
                shadowColor: "#000000",
              },
            ]}
          >
            <Feather name="log-out" size={17} color="#FF3B30" />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </View>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.gray500 }]}>
          Notura v2.0 · Criado com IA
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 2,
  },
  content: {
    paddingHorizontal: 20,
    gap: 18,
  },
  heroCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
    gap: 18,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  heroIdentity: {
    flex: 1,
    gap: 4,
  },
  planBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 2,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  profileName: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  profileEmail: {
    fontSize: 14,
  },
  statsPanel: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statNum: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 34,
  },
  planCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
  },
  planIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  planCardTextWrap: {
    flex: 1,
    gap: 3,
  },
  planCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  planCardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    gap: 4,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  groupCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 22,
    elevation: 2,
  },
  groupDivider: {
    height: 0.5,
    marginLeft: 70,
    marginRight: 16,
  },
  row: {
    minHeight: 78,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  rowIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTextWrap: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
    letterSpacing: -0.2,
  },
  rowSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B6B7A",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  logoutCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 2,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF3B30",
  },
  version: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 6,
  },
});
