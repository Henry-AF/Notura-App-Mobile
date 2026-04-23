import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, Modal, Platform, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppNavbar } from "@/components/AppNavbar";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { GlassBackground } from "@/components/GlassBackground";
import { GlassCard } from "@/components/GlassCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { ActionItem, ActionItemStatus, TaskPriority } from "@/lib/mockData";
import { fetchMeetingDetail, type MeetingDetailData } from "./meeting-detail-api";

const TABS = ["Resumo", "Transcrição", "Ações", "Decisões"] as const;
type Tab = (typeof TABS)[number];
type ActionGroupKey = "todo" | "in_progress" | "done";

const ACTION_GROUPS: Array<{
  key: ActionGroupKey;
  label: string;
  color: string;
  backgroundColor: string;
}> = [
  {
    key: "todo",
    label: "A fazer",
    color: "#5E4CEB",
    backgroundColor: "rgba(94,76,235,0.10)",
  },
  {
    key: "in_progress",
    label: "Em andamento",
    color: "#EF9F27",
    backgroundColor: "rgba(239,159,39,0.12)",
  },
  {
    key: "done",
    label: "Concluído",
    color: "#34C759",
    backgroundColor: "rgba(52,199,89,0.12)",
  },
];

function normalizeActionStatus(action: ActionItem): ActionItemStatus {
  if (action.status) return action.status;
  return action.completed ? "done" : "todo";
}

function priorityLabel(priority: TaskPriority) {
  switch (priority) {
    case "high":
      return "Alta";
    case "medium":
      return "Média";
    case "low":
      return "Baixa";
  }
}

function resolveMeetingId(rawId: string | string[] | undefined) {
  if (Array.isArray(rawId)) {
    return rawId[0] ?? "";
  }

  if (typeof rawId === "string") {
    return rawId;
  }

  return "";
}

function ConversationDetailContentSkeleton({
  colors,
  pulseStyle,
}: {
  colors: ReturnType<typeof useColors>;
  pulseStyle: { opacity: Animated.AnimatedInterpolation<number> };
}) {
  return (
    <View style={styles.tabSection}>
      <GlassCard style={{ gap: 14 }}>
        <View style={styles.summaryHeader}>
          <Animated.View
            style={[
              styles.skeletonIcon,
              { backgroundColor: colors.gray300 },
              pulseStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.skeletonLine,
              styles.skeletonSummaryTitle,
              { backgroundColor: colors.gray300 },
              pulseStyle,
            ]}
          />
        </View>

        <Animated.View
          style={[
            styles.skeletonLine,
            styles.skeletonLineFull,
            { backgroundColor: "#F2F2F7" },
            pulseStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonLine,
            styles.skeletonLineFull,
            { backgroundColor: "#F2F2F7" },
            pulseStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonLine,
            styles.skeletonLineShort,
            { backgroundColor: "#F2F2F7" },
            pulseStyle,
          ]}
        />
      </GlassCard>

      <GlassCard style={{ gap: 14 }}>
        <Animated.View
          style={[
            styles.skeletonLine,
            styles.skeletonSectionTitle,
            { backgroundColor: colors.gray300 },
            pulseStyle,
          ]}
        />

        <Animated.View
          style={[
            styles.skeletonLine,
            styles.skeletonLineMedium,
            { backgroundColor: "#F2F2F7" },
            pulseStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonLine,
            styles.skeletonLineShort,
            { backgroundColor: "#F2F2F7" },
            pulseStyle,
          ]}
        />

        <View style={styles.skeletonPillRow}>
          {[0, 1, 2].map((pill) => (
            <Animated.View
              key={pill}
              style={[
                styles.skeletonPill,
                { backgroundColor: "#F2F2F7" },
                pulseStyle,
              ]}
            />
          ))}
        </View>
      </GlassCard>

      <GlassCard style={{ gap: 14 }}>
        <Animated.View
          style={[
            styles.skeletonLine,
            styles.skeletonSectionTitle,
            { backgroundColor: colors.gray300 },
            pulseStyle,
          ]}
        />

        {[0, 1, 2].map((row) => (
          <View key={row} style={styles.skeletonInsightRow}>
            <Animated.View
              style={[
                styles.skeletonAvatar,
                { backgroundColor: colors.gray300 },
                pulseStyle,
              ]}
            />
            <View style={{ flex: 1, gap: 8 }}>
              <Animated.View
                style={[
                  styles.skeletonLine,
                  styles.skeletonLineMedium,
                  { backgroundColor: "#F2F2F7" },
                  pulseStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.skeletonLine,
                  styles.skeletonLineShort,
                  { backgroundColor: "#F2F2F7" },
                  pulseStyle,
                ]}
              />
            </View>
          </View>
        ))}
      </GlassCard>
    </View>
  );
}

export default function ConversationDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id: rawId } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = resolveMeetingId(rawId);
  const { updateActionItem, removeActionItem, addHighlight } = useApp();
  const meetingDetailQuery = useQuery({
    queryKey: ["meeting-detail", id],
    queryFn: () => fetchMeetingDetail(id),
    enabled: id.length > 0,
  });
  const [activeTab, setActiveTab] = useState<Tab>("Resumo");
  const [expandedActionGroups, setExpandedActionGroups] = useState<Record<ActionGroupKey, boolean>>({
    todo: true,
    in_progress: true,
    done: true,
  });
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [localActionItems, setLocalActionItems] = useState<ActionItem[] | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftDueDate, setDraftDueDate] = useState("");
  const [draftPriority, setDraftPriority] = useState<TaskPriority>("medium");
  const [draftStatus, setDraftStatus] = useState<ActionItemStatus>("todo");
  const skeletonPulse = useRef(new Animated.Value(0)).current;

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  useEffect(() => {
    setLocalActionItems(null);
  }, [meetingDetailQuery.data?.id]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(skeletonPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.bezier(0.3, 0, 0.1, 1),
          useNativeDriver: true,
        }),
        Animated.timing(skeletonPulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.bezier(0.3, 0, 0.1, 1),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [skeletonPulse]);

  if (id.length === 0) {
    return (
      <GlassBackground>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.bodyText, fontSize: 16 }}>Conversa não encontrada</Text>
        </View>
      </GlassBackground>
    );
  }

  if (meetingDetailQuery.isError) {
    return (
      <GlassBackground>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 28 }}>
          <Text style={{ color: colors.bodyText, fontSize: 16, textAlign: "center" }}>
            Nao foi possivel carregar os detalhes desta reunião.
          </Text>
        </View>
      </GlassBackground>
    );
  }

  const skeletonPulseStyle = {
    opacity: skeletonPulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.62, 1],
    }),
  };
  const isPending = meetingDetailQuery.isPending;

  if (!meetingDetailQuery.data && !isPending) {
    return (
      <GlassBackground>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.bodyText, fontSize: 16 }}>Conversa não encontrada</Text>
        </View>
      </GlassBackground>
    );
  }

  const conversation: MeetingDetailData | null = meetingDetailQuery.data
    ? localActionItems === null
      ? meetingDetailQuery.data
      : {
          ...meetingDetailQuery.data,
          actionItems: localActionItems,
        }
    : null;

  const groupedActions: Record<ActionGroupKey, ActionItem[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };

  for (const action of conversation?.actionItems ?? []) {
    groupedActions[normalizeActionStatus(action)].push(action);
  }

  function handleShare() {
    if (!conversation) return;
    Share.share({ title: conversation.title, message: `${conversation.title}\n\n${conversation.summary}` });
  }

  function handleBookmark(segId: string) {
    if (!conversation) return;
    const seg = conversation.transcript.find((s) => s.id === segId);
    if (!seg) return;
    addHighlight({
      id: `h-${Date.now()}`,
      conversationId: conversation.id,
      conversationTitle: conversation.title,
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

  function toggleActionGroup(group: ActionGroupKey) {
    setExpandedActionGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  }

  function openActionSheet(action: ActionItem) {
    setSelectedAction(action);
    setDraftTitle(action.text);
    setDraftDescription(action.description ?? "");
    setDraftDueDate(action.dueDate ?? "");
    setDraftPriority(action.priority);
    setDraftStatus(normalizeActionStatus(action));
  }

  function closeActionSheet() {
    setSelectedAction(null);
    setDraftTitle("");
    setDraftDescription("");
    setDraftDueDate("");
    setDraftPriority("medium");
    setDraftStatus("todo");
  }

  function handleSaveAction() {
    if (!selectedAction || !draftTitle.trim() || !conversation) return;

    setLocalActionItems((prev) => {
      const source = prev ?? conversation.actionItems;
      return source.map((action) =>
        action.id === selectedAction.id
          ? {
              ...action,
              text: draftTitle.trim(),
              description: draftDescription.trim() || undefined,
              dueDate: draftDueDate.trim() || undefined,
              priority: draftPriority,
              status: draftStatus,
              completed: draftStatus === "done",
            }
          : action,
      );
    });

    updateActionItem(conversation.id, selectedAction.id, {
      text: draftTitle.trim(),
      description: draftDescription.trim() || undefined,
      dueDate: draftDueDate.trim() || undefined,
      priority: draftPriority,
      status: draftStatus,
      completed: draftStatus === "done",
    });

    closeActionSheet();
  }

  function handleDeleteAction() {
    if (!selectedAction || !conversation) return;
    setLocalActionItems((prev) => {
      const source = prev ?? conversation.actionItems;
      return source.filter((action) => action.id !== selectedAction.id);
    });
    removeActionItem(conversation.id, selectedAction.id);
    closeActionSheet();
  }

  return (
    <GlassBackground>
      <View style={styles.root}>
        <AppNavbar title="Conversa" showBackButton />
        {!isPending ? (
          <>
            <View style={styles.headerActionsRow}>
              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: "rgba(175,82,222,0.08)" }]} onPress={handleShare}>
                <Feather name="share-2" size={16} color={colors.heading} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, { backgroundColor: "rgba(175,82,222,0.08)" }]}>
                <Feather name="more-horizontal" size={16} color={colors.heading} />
              </TouchableOpacity>
            </View>

            <View style={styles.titleSection}>
              <Text style={[styles.convTitle, { color: colors.heading }]}>{conversation.title}</Text>
              <View style={styles.convMeta}>
                <Text style={[styles.metaText, { color: colors.bodyText }]}>{conversation.date}</Text>
                <View style={[styles.metaDot, { backgroundColor: colors.gray300 }]} />
                <Text style={[styles.metaText, { color: colors.bodyText }]}>{conversation.duration}</Text>
                {conversation.wordCount && conversation.wordCount > 0 ? (
                  <>
                    <View style={[styles.metaDot, { backgroundColor: colors.gray300 }]} />
                    <Text style={[styles.metaText, { color: colors.bodyText }]}>{conversation.wordCount.toLocaleString("pt-BR")} palavras</Text>
                  </>
                ) : null}
              </View>
              <View style={styles.speakerRow}>
                <View style={styles.speakerStack}>
                  {conversation.speakers.map((sp, idx) => (
                    <View
                      key={sp.id}
                      style={[
                        styles.speakerAvatarWrap,
                        { marginLeft: idx > 0 ? -8 : 0, borderColor: "#FFFFFF" },
                      ]}
                    >
                      <Avatar initials={sp.initials} color={sp.color} size={22} />
                    </View>
                  ))}
                </View>
                <Text style={[styles.speakerCount, { color: colors.bodyText }]}>
                  {conversation.speakers.length} participante{conversation.speakers.length > 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.pendingHeaderSpacer} />
        )}

        <View style={[styles.tabBar, { borderBottomColor: "rgba(175,82,222,0.15)" }]}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabBtn}
              onPress={() => {
                if (!isPending) setActiveTab(tab);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.gray400, fontWeight: activeTab === tab ? "600" : "400" }]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={[styles.tabContent, { paddingBottom: bottomPad }]} showsVerticalScrollIndicator={false}>
          {isPending ? (
            <ConversationDetailContentSkeleton colors={colors} pulseStyle={skeletonPulseStyle} />
          ) : (
            <>
              {activeTab === "Resumo" && conversation && (
                <View style={styles.tabSection}>
                  {conversation.status === "processing" ? (
                    <GlassCard style={{ alignItems: "center", gap: 12 }}>
                      <Feather name="loader" size={22} color="#FF9500" />
                      <Text style={[styles.processingText, { color: colors.bodyText }]}>A IA está gerando seu resumo...</Text>
                    </GlassCard>
                  ) : (
                    <>
                      <GlassCard style={{ gap: 10 }}>
                        <View style={styles.summaryHeader}>
                          <View style={[styles.summaryIcon, { backgroundColor: "rgba(175,82,222,0.10)" }]}>
                            <Feather name="zap" size={12} color={colors.primary} />
                          </View>
                          <Text style={[styles.summaryTitle, { color: colors.heading }]}>Resumo IA</Text>
                        </View>
                        <Text style={[styles.summaryText, { color: colors.bodyText }]}>{conversation.summary}</Text>
                      </GlassCard>

                      {conversation.keyPoints.length > 0 && (
                        <GlassCard style={{ gap: 10 }}>
                          <Text style={[styles.cardSectionTitle, { color: colors.heading }]}>Pontos-chave</Text>
                          {conversation.keyPoints.map((kp, i) => (
                            <View key={i} style={styles.kpRow}>
                              <View style={[styles.kpDot, { backgroundColor: colors.primary }]} />
                              <Text style={[styles.kpText, { color: colors.bodyText }]}>{kp}</Text>
                            </View>
                          ))}
                        </GlassCard>
                      )}

                      <GlassCard style={{ gap: 12 }}>
                        <Text style={[styles.cardSectionTitle, { color: colors.heading }]}>Participantes</Text>
                        {conversation.speakers.map((sp) => (
                          <View key={sp.id} style={styles.participantRow}>
                            <Avatar initials={sp.initials} color={sp.color} size={34} />
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.participantName, { color: colors.heading }]}>{sp.name}</Text>
                              <View style={[styles.spTrack, { backgroundColor: "rgba(175,82,222,0.12)" }]}>
                                <View style={[styles.spFill, { width: `${sp.talkTimePercent}%` as any, backgroundColor: sp.color }]} />
                              </View>
                            </View>
                            <Text style={[styles.spPct, { color: colors.bodyText }]}>{sp.talkTimePercent}%</Text>
                          </View>
                        ))}
                      </GlassCard>
                    </>
                  )}
                </View>
              )}

              {activeTab === "Transcrição" && conversation && (
            <View style={styles.tabSection}>
              {conversation.transcript.length === 0 ? (
                <View style={styles.empty}>
                  <View style={[styles.emptyIcon, { backgroundColor: "rgba(175,82,222,0.08)" }]}>
                    <Feather name="file-text" size={28} color={colors.gray400} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: colors.heading }]}>
                    {conversation.status === "processing" ? "Processando transcrição..." : "Sem transcrição"}
                  </Text>
                </View>
              ) : (
                conversation.transcript.map((seg) => (
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
                      <Text style={[styles.segText, { color: colors.bodyText }, seg.isHighlighted && { backgroundColor: "rgba(175,82,222,0.08)", borderRadius: 6 }]}>
                        {seg.text}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

              {activeTab === "Ações" && conversation && (
            <View style={styles.tabSection}>
              {conversation.actionItems.length === 0 ? (
                <View style={styles.empty}>
                  <View style={[styles.emptyIcon, { backgroundColor: "rgba(175,82,222,0.08)" }]}>
                    <Feather name="check-square" size={28} color={colors.gray400} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: colors.heading }]}>Sem itens de ação</Text>
                </View>
              ) : (
                ACTION_GROUPS.map((group) => {
                  const actions = groupedActions[group.key];
                  const expanded = expandedActionGroups[group.key];

                  return (
                    <GlassCard key={group.key} noPad style={styles.actionGroupCard}>
                      <TouchableOpacity
                        style={styles.actionGroupHeader}
                        onPress={() => toggleActionGroup(group.key)}
                        activeOpacity={0.86}
                      >
                        <View style={styles.actionGroupHeaderLeft}>
                          <View style={[styles.actionGroupPill, { backgroundColor: group.backgroundColor }]}>
                            <View style={[styles.actionGroupDot, { backgroundColor: group.color }]} />
                            <Text style={[styles.actionGroupLabel, { color: group.color }]}>{group.label}</Text>
                          </View>
                          <Text style={[styles.actionGroupCount, { color: colors.bodyText }]}>{actions.length}</Text>
                        </View>
                        <Feather
                          name={expanded ? "chevron-up" : "chevron-down"}
                          size={16}
                          color={colors.gray400}
                        />
                      </TouchableOpacity>

                      {expanded && (
                        <View style={styles.actionGroupBody}>
                          {actions.length === 0 ? (
                            <Text style={[styles.actionGroupEmpty, { color: colors.gray400 }]}>
                              Nenhuma tarefa neste grupo.
                            </Text>
                          ) : (
                            actions.map((action, idx) => (
                              <View key={action.id}>
                                <TouchableOpacity
                                  style={styles.actionCell}
                                  onPress={() => openActionSheet(action)}
                                  activeOpacity={0.88}
                                >
                                  <View style={styles.actionCellHeader}>
                                    <Text style={[styles.actionText, { color: colors.heading }]}>{action.text}</Text>
                                    <Badge
                                      label={priorityLabel(action.priority)}
                                      variant={action.priority === "high" ? "error" : action.priority === "medium" ? "warning" : "default"}
                                    />
                                  </View>

                                  {action.description ? (
                                    <Text style={[styles.actionDescription, { color: colors.bodyText }]} numberOfLines={2}>
                                      {action.description}
                                    </Text>
                                  ) : null}

                                  <View style={styles.actionMeta}>
                                    <Avatar initials={action.assigneeInitials} color={action.assigneeColor} size={18} />
                                    <Text style={[styles.actionAssignee, { color: colors.bodyText }]}>{action.assignee}</Text>
                                    {action.dueDate ? (
                                      <>
                                        <View style={[styles.metaDot, { backgroundColor: colors.gray300 }]} />
                                        <Text style={[styles.actionDue, { color: colors.gray400 }]}>Vence {action.dueDate}</Text>
                                      </>
                                    ) : null}
                                  </View>
                                </TouchableOpacity>

                                {idx < actions.length - 1 ? (
                                  <View style={[styles.divider, { backgroundColor: "rgba(28,28,30,0.08)", marginLeft: 18, marginRight: 18 }]} />
                                ) : null}
                              </View>
                            ))
                          )}
                        </View>
                      )}
                    </GlassCard>
                  );
                })
              )}
            </View>
          )}

              {activeTab === "Decisões" && conversation && (
            <View style={styles.tabSection}>
              {conversation.decisions.length === 0 ? (
                <View style={styles.empty}>
                  <View style={[styles.emptyIcon, { backgroundColor: "rgba(175,82,222,0.08)" }]}>
                    <Feather name="check-circle" size={28} color={colors.gray400} />
                  </View>
                  <Text style={[styles.emptyTitle, { color: colors.heading }]}>Sem decisões</Text>
                  <Text style={[styles.emptySub, { color: colors.bodyText }]}>
                    As decisões extraídas da reunião aparecerão aqui quando disponíveis
                  </Text>
                </View>
              ) : (
                conversation.decisions.map((decision) => (
                  <GlassCard key={decision.id} noPad style={{ marginBottom: 10 }}>
                    <View style={styles.hlCardInner}>
                      <View style={styles.hlHeader}>
                        <Feather name="check-circle" size={14} color={colors.primary} />
                        <Text style={[styles.decisionTitle, { color: colors.heading }]}>Decisão</Text>
                        {decision.decidedBy ? (
                          <Text style={[styles.hlTime, { color: colors.gray400 }]}>por {decision.decidedBy}</Text>
                        ) : null}
                        {decision.confidence ? <Badge label={decision.confidence} variant="primary" /> : null}
                      </View>
                      <Text style={[styles.decisionText, { color: colors.bodyText }]}>{decision.description}</Text>
                    </View>
                  </GlassCard>
                ))
              )}
            </View>
          )}
            </>
          )}
        </ScrollView>
      </View>

      <Modal
        visible={Boolean(selectedAction)}
        transparent
        animationType="slide"
        onRequestClose={closeActionSheet}
      >
        <View style={styles.sheetRoot}>
          <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={closeActionSheet} />
          <View style={[styles.sheetCard, { paddingBottom: Math.max(insets.bottom, 18) }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.heading }]}>Editar tarefa</Text>
              <TouchableOpacity
                style={[styles.sheetCloseBtn, { backgroundColor: "rgba(175,82,222,0.08)" }]}
                onPress={closeActionSheet}
                activeOpacity={0.8}
              >
                <Feather name="x" size={16} color={colors.bodyText} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { color: colors.bodyText }]}>Título</Text>
                <TextInput
                  value={draftTitle}
                  onChangeText={setDraftTitle}
                  placeholder="Título da tarefa"
                  placeholderTextColor={colors.gray400}
                  style={styles.formInput}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { color: colors.bodyText }]}>Descrição</Text>
                <TextInput
                  value={draftDescription}
                  onChangeText={setDraftDescription}
                  placeholder="Adicionar descrição"
                  placeholderTextColor={colors.gray400}
                  multiline
                  textAlignVertical="top"
                  style={[styles.formInput, styles.formTextarea]}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { color: colors.bodyText }]}>Mover para</Text>
                <View style={styles.optionRow}>
                  {ACTION_GROUPS.map((group) => {
                    const active = draftStatus === group.key;
                    return (
                      <TouchableOpacity
                        key={group.key}
                        style={[
                          styles.optionPill,
                          { backgroundColor: active ? group.backgroundColor : "#F2F2F7", borderColor: active ? group.color : "transparent" },
                        ]}
                        onPress={() => setDraftStatus(group.key)}
                        activeOpacity={0.86}
                      >
                        <Text style={[styles.optionPillText, { color: active ? group.color : colors.gray600 }]}>
                          {group.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { color: colors.bodyText }]}>Prioridade</Text>
                <View style={styles.optionRow}>
                  {(["high", "medium", "low"] as const).map((priority) => {
                    const active = draftPriority === priority;
                    const tintColor = priority === "high" ? "#FF3B30" : priority === "medium" ? "#EF9F27" : "#5E4CEB";
                    return (
                      <TouchableOpacity
                        key={priority}
                        style={[
                          styles.optionPill,
                          { backgroundColor: active ? `${tintColor}1A` : "#F2F2F7", borderColor: active ? tintColor : "transparent" },
                        ]}
                        onPress={() => setDraftPriority(priority)}
                        activeOpacity={0.86}
                      >
                        <Text style={[styles.optionPillText, { color: active ? tintColor : colors.gray600 }]}>
                          {priorityLabel(priority)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { color: colors.bodyText }]}>Vencimento</Text>
                <TextInput
                  value={draftDueDate}
                  onChangeText={setDraftDueDate}
                  placeholder="Ex: 25 abr"
                  placeholderTextColor={colors.gray400}
                  style={styles.formInput}
                />
              </View>

              <View style={styles.sheetFooter}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteAction}
                  activeOpacity={0.86}
                >
                  <Feather name="trash-2" size={16} color="#FF3B30" />
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: colors.primary }]}
                  onPress={handleSaveAction}
                  activeOpacity={0.9}
                >
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerActionsRow: { paddingHorizontal: 20, paddingBottom: 10, flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  pendingHeaderSpacer: { height: 18 },
  titleSection: { paddingHorizontal: 20, gap: 6, marginBottom: 4 },
  convTitle: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  convMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 12 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5 },
  speakerRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  speakerStack: { flexDirection: "row", alignItems: "center" },
  speakerAvatarWrap: { borderWidth: 1.5, borderRadius: 999 },
  speakerCount: { fontSize: 12, fontWeight: "500" },
  tabBar: { flexDirection: "row", borderBottomWidth: 1, marginTop: 4 },
  tabBtn: { flex: 1, alignItems: "center", paddingVertical: 12, position: "relative" },
  tabText: { fontSize: 13 },
  tabIndicator: { position: "absolute", bottom: 0, left: "15%", right: "15%", height: 2, borderRadius: 1 },
  tabContent: { paddingHorizontal: 16, paddingTop: 16 },
  tabSection: { gap: 12 },
  skeletonIcon: { width: 22, height: 22, borderRadius: 7 },
  skeletonAvatar: { width: 34, height: 34, borderRadius: 17 },
  skeletonLine: { height: 12, borderRadius: 999 },
  skeletonSummaryTitle: { width: 92 },
  skeletonSectionTitle: { width: 118 },
  skeletonLineFull: { width: "100%" },
  skeletonLineMedium: { width: "74%" },
  skeletonLineShort: { width: "58%" },
  skeletonPillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skeletonPill: { width: 72, height: 30, borderRadius: 999 },
  skeletonInsightRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  processingText: { fontSize: 14 },
  summaryHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryIcon: { width: 22, height: 22, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  summaryTitle: { fontSize: 13, fontWeight: "600" },
  summaryText: { fontSize: 14, lineHeight: 22 },
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
  actionGroupCard: { overflow: "hidden" },
  actionGroupHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 16 },
  actionGroupHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  actionGroupPill: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  actionGroupDot: { width: 6, height: 6, borderRadius: 999 },
  actionGroupLabel: { fontSize: 13, fontWeight: "600", letterSpacing: -0.1 },
  actionGroupCount: { fontSize: 12, fontWeight: "500" },
  actionGroupBody: { paddingBottom: 4 },
  actionGroupEmpty: { fontSize: 13, paddingHorizontal: 18, paddingBottom: 16 },
  actionCell: { paddingHorizontal: 18, paddingVertical: 14, gap: 8 },
  actionCellHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  actionText: { fontSize: 14, fontWeight: "500", lineHeight: 19 },
  actionDescription: { fontSize: 13, lineHeight: 19 },
  actionMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  actionAssignee: { fontSize: 11 },
  actionDue: { fontSize: 11 },
  divider: { height: 0.5 },
  sheetRoot: { flex: 1, justifyContent: "flex-end" },
  sheetBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15,23,42,0.22)" },
  sheetCard: {
    backgroundColor: "#FBFBFE",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    paddingTop: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    maxHeight: "82%",
  },
  sheetHandle: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(28,28,30,0.14)",
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sheetTitle: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  sheetCloseBtn: { width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  sheetBody: { paddingHorizontal: 20, gap: 18 },
  formSection: { gap: 8 },
  formLabel: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  formInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1C1C1E",
  },
  formTextarea: { minHeight: 110 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optionPillText: { fontSize: 13, fontWeight: "600" },
  sheetFooter: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 4 },
  deleteButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,59,48,0.10)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  deleteButtonText: { fontSize: 14, fontWeight: "600", color: "#FF3B30" },
  saveButton: {
    flex: 1.4,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
  hlCardInner: { padding: 14, gap: 8 },
  hlHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  hlSpeaker: { fontSize: 12, fontWeight: "600", flex: 1 },
  hlTime: { fontSize: 11 },
  hlText: { fontSize: 13, lineHeight: 20, fontStyle: "italic" },
  decisionTitle: { fontSize: 12, fontWeight: "700", flex: 1 },
  decisionText: { fontSize: 13, lineHeight: 20 },
  empty: { alignItems: "center", paddingTop: 56, gap: 10 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  emptySub: { fontSize: 13, textAlign: "center", paddingHorizontal: 32 },
});
