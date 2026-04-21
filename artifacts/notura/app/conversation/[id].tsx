import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const TABS = ["Resumo", "Transcrição", "Ações", "Destaques"] as const;
type Tab = (typeof TABS)[number];

function cardShadow() {
  if (Platform.OS === "ios") {
    return { shadowColor: "#000" as const, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12 };
  }
  return { elevation: 1 as const };
}

export default function ConversationDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { conversations, toggleActionItem, addHighlight, highlights } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("Resumo");

  const conv = useMemo(() => conversations.find((c) => c.id === id), [conversations, id]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  if (!conv) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={[styles.notFound, { color: colors.gray500 }]}>Conversa não encontrada</Text>
      </View>
    );
  }

  const convHighlights = (conv.highlights ?? []).concat(
    highlights.filter(
      (h) => h.conversationId === id && !conv.highlights?.find((ch) => ch.id === h.id)
    )
  );

  function handleShare() {
    Share.share({ title: conv.title, message: `${conv.title}\n\n${conv.summary ?? ""}` });
  }

  function handleBookmark(segId: string) {
    const seg = conv.transcript?.find((s) => s.id === segId);
    if (!seg) return;
    addHighlight({
      id: `h-${Date.now()}`,
      conversationId: conv.id,
      conversationTitle: conv.title,
      speakerName: seg.speakerName,
      speakerInitials: seg.speakerInitials,
      speakerColor: seg.speakerColor,
      text: seg.text,
      timeLabel: seg.timeLabel,
      createdAt: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short" }),
      tag: "Destaque",
    });
    Alert.alert("Salvo", "Adicionado aos seus destaques.");
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.secondary }]} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.secondary }]} onPress={handleShare}>
            <Feather name="share-2" size={16} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.secondary }]}>
            <Feather name="more-horizontal" size={16} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={[styles.convTitle, { color: colors.foreground }]}>{conv.title}</Text>
        <View style={styles.convMeta}>
          <Text style={[styles.metaText, { color: colors.gray500 }]}>{conv.date}</Text>
          <View style={[styles.metaDot, { backgroundColor: colors.gray300 }]} />
          <Text style={[styles.metaText, { color: colors.gray500 }]}>{conv.duration}</Text>
          {conv.wordCount && conv.wordCount > 0 ? (
            <>
              <View style={[styles.metaDot, { backgroundColor: colors.gray300 }]} />
              <Text style={[styles.metaText, { color: colors.gray500 }]}>
                {conv.wordCount.toLocaleString("pt-BR")} palavras
              </Text>
            </>
          ) : null}
        </View>
        <View style={styles.speakerRow}>
          {conv.speakers.map((sp) => (
            <View key={sp.id} style={styles.speakerItem}>
              <Avatar initials={sp.initials} color={sp.color} size={18} />
              <Text style={[styles.speakerName, { color: colors.gray600 }]}>{sp.name.split(" ")[0]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.tabBar, { borderBottomColor: colors.border }]}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} style={styles.tabBtn} onPress={() => setActiveTab(tab)} activeOpacity={0.7}>
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.primary : colors.gray400, fontWeight: activeTab === tab ? "600" : "400" },
              ]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={[styles.tabContent, { paddingBottom: bottomPad }]} showsVerticalScrollIndicator={false}>
        {activeTab === "Resumo" && (
          <View style={styles.tabSection}>
            {conv.status === "processing" ? (
              <View style={[styles.processingCard, { backgroundColor: colors.card, ...cardShadow() }]}>
                <Feather name="loader" size={22} color={colors.warning} />
                <Text style={[styles.processingText, { color: colors.gray600 }]}>
                  A IA está gerando seu resumo...
                </Text>
              </View>
            ) : (
              <>
                <View style={[styles.summaryCard, { backgroundColor: colors.card, ...cardShadow() }]}>
                  <View style={styles.summaryHeader}>
                    <View style={[styles.summaryIcon, { backgroundColor: colors.brandSubtle }]}>
                      <Feather name="zap" size={12} color={colors.primary} />
                    </View>
                    <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Resumo IA</Text>
                  </View>
                  <Text style={[styles.summaryText, { color: colors.gray700 }]}>{conv.summary}</Text>
                </View>

                {conv.keyPoints && conv.keyPoints.length > 0 && (
                  <View style={[styles.cardSection, { backgroundColor: colors.card, ...cardShadow() }]}>
                    <Text style={[styles.cardSectionTitle, { color: colors.foreground }]}>Pontos-chave</Text>
                    {conv.keyPoints.map((kp, i) => (
                      <View key={i} style={styles.kpRow}>
                        <View style={[styles.kpDot, { backgroundColor: colors.primary }]} />
                        <Text style={[styles.kpText, { color: colors.gray700 }]}>{kp}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={[styles.cardSection, { backgroundColor: colors.card, ...cardShadow() }]}>
                  <Text style={[styles.cardSectionTitle, { color: colors.foreground }]}>Participantes</Text>
                  {conv.speakers.map((sp) => (
                    <View key={sp.id} style={styles.participantRow}>
                      <Avatar initials={sp.initials} color={sp.color} size={34} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.participantName, { color: colors.foreground }]}>{sp.name}</Text>
                        <View style={[styles.spTrack, { backgroundColor: colors.secondary }]}>
                          <View style={[styles.spFill, { width: `${sp.talkTimePercent}%` as any, backgroundColor: sp.color }]} />
                        </View>
                      </View>
                      <Text style={[styles.spPct, { color: colors.gray500 }]}>{sp.talkTimePercent}%</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {activeTab === "Transcrição" && (
          <View style={styles.tabSection}>
            {(conv.transcript ?? []).length === 0 ? (
              <View style={styles.empty}>
                <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
                  <Feather name="file-text" size={28} color={colors.gray300} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                  {conv.status === "processing" ? "Processando transcrição..." : "Sem transcrição"}
                </Text>
              </View>
            ) : (
              conv.transcript!.map((seg) => (
                <View key={seg.id} style={styles.segRow}>
                  <Avatar initials={seg.speakerInitials} color={seg.speakerColor} size={28} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.segHeader}>
                      <Text style={[styles.segSpeaker, { color: seg.speakerColor }]}>{seg.speakerName}</Text>
                      <Text style={[styles.segTime, { color: colors.gray400 }]}>{seg.timeLabel}</Text>
                      <TouchableOpacity onPress={() => handleBookmark(seg.id)}>
                        <Feather name="bookmark" size={13} color={colors.gray300} />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={[
                        styles.segText,
                        { color: colors.gray700 },
                        seg.isHighlighted && { backgroundColor: colors.brandSubtle, borderRadius: 6, overflow: "hidden" },
                      ]}
                    >
                      {seg.text}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === "Ações" && (
          <View style={styles.tabSection}>
            {(conv.actionItems ?? []).length === 0 ? (
              <View style={styles.empty}>
                <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
                  <Feather name="check-square" size={28} color={colors.gray300} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Sem itens de ação</Text>
              </View>
            ) : (
              <View style={[styles.groupCard, { backgroundColor: colors.card, ...cardShadow() }]}>
                {conv.actionItems!.map((action, idx) => (
                  <View key={action.id}>
                    <TouchableOpacity
                      style={[styles.actionRow, action.completed && { opacity: 0.5 }]}
                      onPress={() => toggleActionItem(conv.id, action.id)}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          { borderColor: action.completed ? colors.success : colors.gray300, backgroundColor: action.completed ? colors.success : "transparent" },
                        ]}
                      >
                        {action.completed && <Feather name="check" size={11} color="#fff" />}
                      </View>
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text style={[styles.actionText, { color: colors.foreground }, action.completed && { textDecorationLine: "line-through" }]}>
                          {action.text}
                        </Text>
                        <View style={styles.actionMeta}>
                          <Avatar initials={action.assigneeInitials} color={action.assigneeColor} size={16} />
                          <Text style={[styles.actionAssignee, { color: colors.gray500 }]}>{action.assignee}</Text>
                          {action.dueDate && (
                            <>
                              <View style={[styles.metaDot, { backgroundColor: colors.gray300 }]} />
                              <Text style={[styles.actionDue, { color: colors.gray400 }]}>{action.dueDate}</Text>
                            </>
                          )}
                        </View>
                      </View>
                      <Badge
                        label={action.priority === "high" ? "alta" : action.priority === "medium" ? "média" : "baixa"}
                        variant={action.priority === "high" ? "error" : action.priority === "medium" ? "warning" : "default"}
                      />
                    </TouchableOpacity>
                    {idx < conv.actionItems!.length - 1 && (
                      <View style={[styles.divider, { backgroundColor: colors.border, marginLeft: 48 }]} />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === "Destaques" && (
          <View style={styles.tabSection}>
            {convHighlights.length === 0 ? (
              <View style={styles.empty}>
                <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
                  <Feather name="bookmark" size={28} color={colors.gray300} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Sem destaques</Text>
                <Text style={[styles.emptySub, { color: colors.gray500 }]}>
                  Toque no ícone de marcador na transcrição para salvar momentos importantes
                </Text>
              </View>
            ) : (
              convHighlights.map((h) => (
                <View
                  key={h.id}
                  style={[styles.highlightCard, { backgroundColor: colors.card, borderLeftColor: h.speakerColor, ...cardShadow() }]}
                >
                  <View style={styles.hlHeader}>
                    <Avatar initials={h.speakerInitials} color={h.speakerColor} size={22} />
                    <Text style={[styles.hlSpeaker, { color: h.speakerColor }]}>{h.speakerName}</Text>
                    <Text style={[styles.hlTime, { color: colors.gray400 }]}>{h.timeLabel}</Text>
                    {h.tag && <Badge label={h.tag} variant="primary" />}
                  </View>
                  <Text style={[styles.hlText, { color: colors.gray700 }]}>"{h.text}"</Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 10 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerActions: { flexDirection: "row", gap: 8 },
  titleSection: { paddingHorizontal: 20, gap: 6, marginBottom: 4 },
  convTitle: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  convMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 12 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5 },
  speakerRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  speakerItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  speakerName: { fontSize: 12 },
  tabBar: { flexDirection: "row", borderBottomWidth: 0.5, marginTop: 4 },
  tabBtn: { flex: 1, alignItems: "center", paddingVertical: 12, position: "relative" },
  tabText: { fontSize: 13 },
  tabIndicator: { position: "absolute", bottom: 0, left: "15%", right: "15%", height: 2, borderRadius: 1 },
  tabContent: { paddingHorizontal: 16, paddingTop: 16 },
  tabSection: { gap: 12 },
  processingCard: { borderRadius: 16, padding: 24, alignItems: "center", gap: 12 },
  processingText: { fontSize: 14 },
  summaryCard: { borderRadius: 16, padding: 16, gap: 10 },
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryIcon: { width: 22, height: 22, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  summaryTitle: { fontSize: 13, fontWeight: "600" },
  summaryText: { fontSize: 14, lineHeight: 22 },
  cardSection: { borderRadius: 16, padding: 16, gap: 12 },
  cardSectionTitle: { fontSize: 14, fontWeight: "600" },
  kpRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  kpDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  kpText: { flex: 1, fontSize: 13, lineHeight: 20 },
  participantRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  participantName: { fontSize: 14, fontWeight: "500", marginBottom: 5 },
  spTrack: { height: 5, borderRadius: 3, overflow: "hidden" },
  spFill: { height: 5, borderRadius: 3 },
  spPct: { fontSize: 12, width: 32, textAlign: "right" },
  segRow: { flexDirection: "row", gap: 10, marginBottom: 18 },
  segHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 },
  segSpeaker: { fontSize: 12, fontWeight: "600", flex: 1 },
  segTime: { fontSize: 11 },
  segText: { fontSize: 14, lineHeight: 21, paddingHorizontal: 2, paddingVertical: 1 },
  groupCard: { borderRadius: 16, overflow: "hidden" },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  actionText: { fontSize: 14, fontWeight: "500", lineHeight: 19 },
  actionMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionAssignee: { fontSize: 11 },
  actionDue: { fontSize: 11 },
  divider: { height: 0.5 },
  highlightCard: { borderRadius: 16, padding: 14, gap: 8, borderLeftWidth: 3 },
  hlHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  hlSpeaker: { fontSize: 12, fontWeight: "600", flex: 1 },
  hlTime: { fontSize: 11 },
  hlText: { fontSize: 13, lineHeight: 20, fontStyle: "italic" },
  empty: { alignItems: "center", paddingTop: 56, gap: 10 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  emptySub: { fontSize: 13, textAlign: "center", paddingHorizontal: 32 },
  notFound: { fontSize: 16 },
});
