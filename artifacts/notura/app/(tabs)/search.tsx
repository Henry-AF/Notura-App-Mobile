import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppNavbar } from "@/components/AppNavbar";
import { useColors } from "@/hooks/useColors";
import {
  fetchMeetingsLibrary,
  type MeetingsLibraryItem,
  type MeetingsLibraryStatus,
} from "./search-api";

function statusMeta(status: MeetingsLibraryStatus, colors: ReturnType<typeof useColors>) {
  switch (status) {
    case "completed":
      return {
        label: "Completado",
        backgroundColor: "rgba(52,199,89,0.12)",
        textColor: colors.success,
      };
    case "processing":
      return {
        label: "Processando",
        backgroundColor: "rgba(255,149,0,0.12)",
        textColor: colors.warning,
      };
    case "failed":
      return {
        label: "Falhou",
        backgroundColor: "rgba(255,59,48,0.12)",
        textColor: colors.error,
      };
  }
}

function MeetingCard({ conversation }: { conversation: MeetingsLibraryItem }) {
  const colors = useColors();
  const router = useRouter();
  const status = statusMeta(conversation.status, colors);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/conversation/${conversation.id}`)}
      style={styles.cardTouchable}
    >
      <View
        style={[
          styles.card,
          Platform.OS === "ios" && styles.cardShadowIos,
          Platform.OS === "android" && styles.cardShadowAndroid,
          Platform.OS === "web" && styles.cardShadowWeb,
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: status.backgroundColor },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: status.textColor },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: status.textColor },
                ]}
              >
                {status.label}
              </Text>
            </View>

            <Feather name="chevron-right" size={18} color="rgba(28,28,30,0.26)" />
          </View>

          <Text style={[styles.cardTitle, { color: colors.heading }]}>
            {conversation.title}
          </Text>

          <View style={styles.cardFooter}>
            <View style={styles.metaInline}>
              <Feather name="calendar" size={12} color="#6D6D72" />
              <Text style={styles.metaText}>Gravada em {conversation.recordedDateLabel}</Text>
            </View>

            <View style={styles.metaInline}>
              <Feather name="clock" size={12} color="#6D6D72" />
              <Text style={styles.metaText}>{conversation.durationLabel}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MeetingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const meetingsLibraryQuery = useQuery({
    queryKey: ["meetings-library"],
    queryFn: () => fetchMeetingsLibrary(),
  });
  const sortedMeetings = meetingsLibraryQuery.data ?? [];

  const statusSummary = useMemo(
    () => ({
      completed: sortedMeetings.filter((meeting) => meeting.status === "completed").length,
      processing: sortedMeetings.filter((meeting) => meeting.status === "processing").length,
      failed: sortedMeetings.filter((meeting) => meeting.status === "failed").length,
    }),
    [sortedMeetings]
  );

  const bottomPad = Platform.OS === "web" ? 34 + 100 : insets.bottom + 110;

  return (
    <View style={styles.root}>
      <AppNavbar title="Reuniões" />

      <FlatList
        data={sortedMeetings}
        keyExtractor={(conversation) => conversation.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        ListHeaderComponent={
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>Biblioteca Privada</Text>
            <Text style={[styles.heroTitle, { color: colors.heading }]}>
              Reuniões gravadas.
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.bodyText }]}>
              {sortedMeetings.length} reuniões ordenadas da mais recente para a mais antiga.
            </Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{statusSummary.completed}</Text>
                <Text style={styles.summaryLabel}>Completadas</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{statusSummary.processing}</Text>
                <Text style={styles.summaryLabel}>Processando</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{statusSummary.failed}</Text>
                <Text style={styles.summaryLabel}>Falharam</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item: conversation }) => <MeetingCard conversation={conversation} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Feather name="list" size={24} color="#5E4CEB" />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.heading }]}>
              {meetingsLibraryQuery.isPending
                ? "Carregando reuniões..."
                : meetingsLibraryQuery.isError
                  ? "Falha ao carregar reuniões"
                  : "Nenhuma reunião ainda"}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.bodyText }]}>
              {meetingsLibraryQuery.isError
                ? "Nao foi possivel carregar suas reuniões agora."
                : "Quando suas gravações aparecerem, elas ficarão listadas aqui por data."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { paddingHorizontal: 20, paddingTop: 8 },
  hero: { marginBottom: 22, gap: 8 },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "rgba(94,76,235,0.78)",
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "700",
    letterSpacing: -1.2,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 320,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#F7F7FB",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(28,28,30,0.04)",
  },
  summaryValue: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "#1C1C1E",
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: "#6D6D72",
  },
  cardTouchable: {
    marginBottom: 12,
  },
  card: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(28,28,30,0.06)",
  },
  cardShadowIos: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
  },
  cardShadowAndroid: {
    elevation: 3,
  },
  cardShadowWeb: {
    boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
  } as any,
  cardContent: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "600",
    letterSpacing: -0.45,
  },
  cardFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  metaInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#6D6D72",
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 10,
  },
  emptyIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "rgba(94,76,235,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    maxWidth: 280,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
});
