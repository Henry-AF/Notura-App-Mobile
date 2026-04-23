import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

import { processLocalRecording } from "@/app/record-api";
import { WaveformBars } from "@/components/WaveformBars";
import { useColors } from "@/hooks/useColors";
import { useRecording } from "@/lib/hooks/useRecording";
import {
  requestLocalNotificationPermissions,
  scheduleLocalNotification,
} from "@/lib/notifications";
import { deleteLocalRecordingFile } from "@/lib/recording-files";
import { formatRecordingTimer, useRecordingStore } from "@/stores/useRecordingStore";

export function RecordingBottomSheet() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height: viewportHeight } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(520)).current;
  const dragDismissThreshold = 120;
  const dragExpandThreshold = 80;
  const [completedRecording, setCompletedRecording] = useState<{
    localUri: string;
    elapsedSeconds: number;
  } | null>(null);
  const [isProcessingMeeting, setIsProcessingMeeting] = useState(false);
  const { start, pause, resume, stop } = useRecording();
  const {
    sheetState,
    status,
    elapsedSeconds,
    openRecordingSheet,
    closeRecordingSheet,
    expandRecordingSheet,
    startRecordingSession,
    pauseRecordingSession,
    resumeRecordingSession,
    stopRecordingSession,
  } = useRecordingStore(useShallow((state) => ({
    sheetState: state.sheetState,
    status: state.status,
    elapsedSeconds: state.elapsedSeconds,
    openRecordingSheet: state.openRecordingSheet,
    closeRecordingSheet: state.closeRecordingSheet,
    expandRecordingSheet: state.expandRecordingSheet,
    startRecordingSession: state.startRecordingSession,
    pauseRecordingSession: state.pauseRecordingSession,
    resumeRecordingSession: state.resumeRecordingSession,
    stopRecordingSession: state.stopRecordingSession,
  })));
  const isHidden = sheetState === "hidden";
  const isExpanded = sheetState === "expanded";
  const closedOffset = 520;
  const partialOffset = 0;
  const expandedOffset = -Math.max(120, insets.top + 28);
  const partialHeight = Math.min(viewportHeight * 0.78, viewportHeight - insets.top - 92);
  const expandedHeight = viewportHeight - insets.top - 12;
  const hasCompletedRecording = completedRecording !== null;

  function getSheetOffset(nextState: typeof sheetState) {
    if (nextState === "expanded") return expandedOffset;
    if (nextState === "partial") return partialOffset;
    return closedOffset;
  }

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: getSheetOffset(sheetState),
      useNativeDriver: true,
      damping: 24,
      stiffness: 220,
      mass: 0.9,
    }).start();
  }, [sheetState, translateY, closedOffset, expandedOffset, partialOffset]);

  useEffect(() => {
    void requestLocalNotificationPermissions();
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dy) > 6 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
    onPanResponderMove: (_, gestureState) => {
      const baseOffset = getSheetOffset(sheetState);
      const nextOffset = Math.min(closedOffset, Math.max(expandedOffset, baseOffset + gestureState.dy));
      translateY.setValue(nextOffset);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > dragDismissThreshold || gestureState.vy > 1.1) {
        closeRecordingSheet();
        return;
      }
      if (gestureState.dy < -dragExpandThreshold || gestureState.vy < -1.1) {
        expandRecordingSheet();
        return;
      }

      Animated.spring(translateY, {
        toValue: getSheetOffset(sheetState),
        useNativeDriver: true,
        damping: 24,
        stiffness: 240,
        mass: 0.85,
      }).start();
    },
    onPanResponderTerminate: () => {
      Animated.spring(translateY, {
        toValue: getSheetOffset(sheetState),
        useNativeDriver: true,
        damping: 24,
        stiffness: 240,
        mass: 0.85,
      }).start();
    },
  });

  async function handleStart() {
    if (isProcessingMeeting) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await start();
      setCompletedRecording(null);
      startRecordingSession();
    } catch (error) {
      Alert.alert(
        "Não foi possível iniciar a gravação",
        "Verifique a permissão de microfone e tente novamente.",
      );
    }
  }

  async function handleTogglePause() {
    if (isProcessingMeeting) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (status === "paused") {
        resume();
        resumeRecordingSession();
        return;
      }

      pause();
      pauseRecordingSession();
    } catch {
      Alert.alert("Não foi possível atualizar a gravação", "Tente novamente em alguns segundos.");
    }
  }

  function handleClose() {
    closeRecordingSheet();
  }

  async function handleStop() {
    if (isProcessingMeeting) return;

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const finishedRecording = await stop();
      const snapshot = stopRecordingSession();
      setCompletedRecording({
        localUri: finishedRecording.uri,
        elapsedSeconds: snapshot.elapsedSeconds,
      });
      openRecordingSheet();
      await scheduleLocalNotification({
        title: "Gravação finalizada",
        body: "Você pode processar a reunião ou descartar o áudio.",
      });
    } catch {
      Alert.alert(
        "Não foi possível finalizar a gravação",
        "O áudio local não foi salvo corretamente. Tente novamente.",
      );
    }
  }

  async function discardLocalRecording() {
    if (!completedRecording) return;

    await deleteLocalRecordingFile(completedRecording.localUri);
    setCompletedRecording(null);
  }

  function handleDiscardRecording() {
    if (!completedRecording) return;

    Alert.alert("Descartar gravação", "Essa ação remove o áudio local gravado.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Descartar",
        style: "destructive",
        onPress: () => {
          void discardLocalRecording();
        },
      },
    ]);
  }

  async function handleProcessRecording() {
    if (!completedRecording || isProcessingMeeting) return;

    try {
      setIsProcessingMeeting(true);
      const now = new Date();
      const meetingDate = now.toISOString().slice(0, 10);

      const result = await processLocalRecording({
        localUri: completedRecording.localUri,
        clientName: "Reunião gravada no app",
        meetingDate,
      });

      await deleteLocalRecordingFile(completedRecording.localUri);
      setCompletedRecording(null);
      closeRecordingSheet();

      await scheduleLocalNotification({
        title: "Processamento iniciado",
        body: "Sua reunião está sendo processada pela IA.",
      });

      router.push(`/conversation/${result.meetingId}`);
    } catch {
      Alert.alert(
        "Falha ao processar reunião",
        "Não foi possível enviar o áudio agora. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setIsProcessingMeeting(false);
    }
  }

  const isSessionActive = status !== "idle";
  const isPaused = status === "paused";

  if (sheetState === "hidden") return null;

  return (
    <View pointerEvents={isHidden ? "box-none" : "auto"} style={styles.host}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose} />

      <Animated.View
        pointerEvents="auto"
        style={[
          styles.sheetWrap,
          {
            paddingBottom: Math.max(insets.bottom, 18),
            transform: [{ translateY }],
          },
        ]}
      >
        <View
          style={[
            styles.sheet,
            { maxHeight: isExpanded ? expandedHeight : partialHeight },
            isExpanded && { height: expandedHeight },
            Platform.OS === "ios" && styles.shadowIos,
            Platform.OS === "android" && styles.shadowAndroid,
            Platform.OS === "web" && styles.shadowWeb,
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.handleArea}>
            <View style={styles.handle} />
          </View>

          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>Gravação</Text>
              <Text style={[styles.title, { color: colors.heading }]}>
                {hasCompletedRecording
                  ? "Gravação finalizada"
                  : isSessionActive
                    ? "Sessão em andamento"
                    : "Pronto para gravar"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeBtn, { backgroundColor: "rgba(175,82,222,0.10)" }]}
              activeOpacity={0.8}
            >
              <Feather name="x" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.timerBlock}>
            <Text style={[styles.timer, { color: colors.heading }]}>
              {formatRecordingTimer(completedRecording?.elapsedSeconds ?? elapsedSeconds)}
            </Text>
            {status === "recording" ? (
              <View style={styles.liveRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveLabel}>AO VIVO</Text>
              </View>
            ) : isPaused ? (
              <View style={styles.liveRow}>
                <Feather name="pause-circle" size={14} color={colors.primary} />
                <Text style={[styles.pausedLabel, { color: colors.primary }]}>PAUSADA</Text>
              </View>
            ) : hasCompletedRecording ? (
              <View style={styles.liveRow}>
                <Feather name="check-circle" size={14} color={colors.primary} />
                <Text style={[styles.pausedLabel, { color: colors.primary }]}>PRONTA PARA PROCESSAR</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.waveformRow}>
            <WaveformBars
              isActive={status === "recording"}
              barCount={28}
              color={status === "idle" ? "rgba(175,82,222,0.20)" : colors.primary}
              height={44}
            />
          </View>

          {isSessionActive ? (
            <View style={[styles.sessionSpacer, isExpanded && styles.sessionSpacerExpanded]} />
          ) : hasCompletedRecording ? (
            <View style={styles.finishedSummary}>
              <Text style={[styles.finishedSummaryText, { color: colors.bodyText }]}>
                Seu áudio foi salvo localmente. Escolha processar a reunião para enviar à IA ou descarte o arquivo.
              </Text>
            </View>
          ) : (
            <View style={styles.hints}>
              {[
                "Feche o sheet e continue navegando enquanto o microfone grava",
                "Reabra a sessão tocando no indicador acima da tab bar",
                "A sessão continua ativa mesmo com o painel fechado",
              ].map((hint) => (
                <View key={hint} style={styles.hintRow}>
                  <View style={[styles.hintDot, { backgroundColor: "rgba(52,199,89,0.12)" }]}>
                    <Feather name="check" size={12} color="#34C759" />
                  </View>
                  <Text style={[styles.hintText, { color: colors.bodyText }]}>{hint}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.controls}>
            {hasCompletedRecording ? (
              <View style={styles.completedControls}>
                <TouchableOpacity
                  style={[styles.processAction, { backgroundColor: "rgba(255,59,48,0.10)" }]}
                  onPress={handleDiscardRecording}
                  activeOpacity={0.88}
                >
                  <Feather name="trash-2" size={18} color="#FF3B30" />
                  <Text style={[styles.processActionLabel, { color: "#FF3B30" }]}>Descartar reunião</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.processAction, { backgroundColor: colors.primary }]}
                  onPress={handleProcessRecording}
                  activeOpacity={0.9}
                  disabled={isProcessingMeeting}
                >
                  {isProcessingMeeting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Feather name="upload-cloud" size={18} color="#FFFFFF" />
                  )}
                  <Text style={[styles.processActionLabel, { color: "#FFFFFF" }]}>Processar reunião</Text>
                </TouchableOpacity>
              </View>
            ) : !isSessionActive ? (
              <TouchableOpacity
                style={[
                  styles.bigBtn,
                  { backgroundColor: "#FF3B30" },
                  Platform.OS === "ios" && styles.recordShadow,
                ]}
                onPress={handleStart}
                activeOpacity={0.92}
                >
                  <Feather name="mic" size={28} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <View style={styles.activeControls}>
                <TouchableOpacity
                  style={[styles.controlBtn, { backgroundColor: "rgba(255,59,48,0.10)" }]}
                  onPress={handleStop}
                >
                  <Feather name="square" size={20} color="#FF3B30" />
                  <Text style={[styles.controlBtnLabel, { color: "#FF3B30" }]}>Parar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.bigBtn,
                    { backgroundColor: isPaused ? colors.primary : "#FF3B30" },
                    Platform.OS === "ios" && styles.recordShadow,
                  ]}
                  onPress={handleTogglePause}
                  activeOpacity={0.92}
                >
                  <Feather name={isPaused ? "mic" : "pause"} size={28} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlBtn, { backgroundColor: "rgba(175,82,222,0.10)" }]}
                  onPress={openRecordingSheet}
                >
                  <Feather name="bookmark" size={20} color={colors.primary} />
                  <Text style={[styles.controlBtnLabel, { color: colors.primary }]}>Marcar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 12, 22, 0.24)",
  },
  sheetWrap: {
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  shadowIos: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  shadowAndroid: {
    elevation: 12,
  },
  shadowWeb: {
    boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
  } as any,
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(28,28,30,0.14)",
  },
  handleArea: {
    paddingBottom: 14,
    paddingTop: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCopy: {
    gap: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  timerBlock: {
    alignItems: "center",
    gap: 6,
    marginTop: 18,
  },
  timer: {
    fontSize: 48,
    fontWeight: "300",
    letterSpacing: -1.6,
  },
  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },
  liveLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#FF3B30",
  },
  pausedLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  waveformRow: {
    alignItems: "center",
    marginTop: 26,
    marginBottom: 8,
  },
  sessionSpacer: {
    minHeight: 108,
  },
  sessionSpacerExpanded: {
    minHeight: 180,
  },
  hints: {
    gap: 12,
    marginTop: 18,
  },
  finishedSummary: {
    marginTop: 24,
    minHeight: 68,
    justifyContent: "center",
  },
  finishedSummaryText: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  hintDot: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
  },
  controls: {
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 12,
    width: "100%",
  },
  bigBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  activeControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
  },
  completedControls: {
    width: "100%",
    gap: 10,
  },
  processAction: {
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  processActionLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  controlBtnLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  recordShadow: {
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 16,
  },
});
