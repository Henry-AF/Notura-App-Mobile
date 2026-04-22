import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
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

import { WaveformBars } from "@/components/WaveformBars";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { Conversation } from "@/lib/mockData";
import { formatRecordingTimer, useRecordingStore } from "@/stores/useRecordingStore";

export function RecordingBottomSheet() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { height: viewportHeight } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(520)).current;
  const dragDismissThreshold = 120;
  const dragExpandThreshold = 80;
  const { addConversation } = useApp();
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
  const isPartial = sheetState === "partial";
  const isExpanded = sheetState === "expanded";
  const closedOffset = 520;
  const partialOffset = 0;
  const expandedOffset = -Math.max(120, insets.top + 28);
  const partialHeight = Math.min(viewportHeight * 0.78, viewportHeight - insets.top - 92);
  const expandedHeight = viewportHeight - insets.top - 12;

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

  function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    startRecordingSession();
  }

  function handleTogglePause() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (status === "paused") {
      resumeRecordingSession();
      return;
    }

    pauseRecordingSession();
  }

  function handleClose() {
    closeRecordingSheet();
  }

  function handleStop() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const snapshot = stopRecordingSession();
    const duration = formatRecordingTimer(snapshot.elapsedSeconds);
    const conversation: Conversation = {
      id: Date.now().toString(),
      title: "Nova Gravação",
      subtitle: "Recém gravado",
      date: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }),
      dateShort: "Agora mesmo",
      recordedAt: new Date().toISOString(),
      duration,
      durationSeconds: snapshot.elapsedSeconds,
      status: "processing",
      speakers: [],
      transcript: [],
      actionItems: [],
      highlights: [],
    };

    addConversation(conversation);
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
                {isSessionActive ? "Sessão em andamento" : "Pronto para gravar"}
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
            <Text style={[styles.timer, { color: colors.heading }]}>{formatRecordingTimer(elapsedSeconds)}</Text>
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
            {!isSessionActive ? (
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
