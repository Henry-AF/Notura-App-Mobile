import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { GlassBackground } from "@/components/GlassBackground";
import { GlassCard } from "@/components/GlassCard";
import { WaveformBars } from "@/components/WaveformBars";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { Conversation } from "@/lib/mockData";

const LIVE_LINES = [
  { speaker: "Henry Costa", initials: "HC", color: "#9B59D0", text: "Vamos começar o sync semanal. Primeiro item é o lançamento mobile." },
  { speaker: "Sarah Kim", initials: "SK", color: "#34C759", text: "Estamos no prazo para 15 de maio. A correção do módulo de áudio chegou ontem." },
  { speaker: "Marcus Lee", initials: "ML", color: "#FF9500", text: "Ótima notícia. Qual o status do checklist de submissão para a App Store?" },
  { speaker: "Henry Costa", initials: "HC", color: "#9B59D0", text: "Cerca de 80% concluído. Ainda precisamos da política de privacidade e capturas de tela." },
  { speaker: "Sarah Kim", initials: "SK", color: "#34C759", text: "Posso cuidar das capturas de tela hoje. A política de privacidade está com o jurídico." },
  { speaker: "Marcus Lee", initials: "ML", color: "#FF9500", text: "O jurídico disse mais dois dias. Devemos estar prontos para submeter até o fim da semana." },
];

function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function RecordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addConversation } = useApp();

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timer = useTimer(isRecording && !isPaused);

  useEffect(() => {
    if (!isRecording || isPaused) return;
    const id = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev.length >= LIVE_LINES.length) return prev;
        const next = [...prev, prev.length];
        setActiveSpeaker(prev.length % LIVE_LINES.length);
        return next;
      });
    }, 2800);
    return () => clearInterval(id);
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (!isRecording) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isRecording]);

  function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsRecording(true);
    setIsPaused(false);
    setVisibleLines([]);
  }

  function handlePause() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPaused((p) => !p);
  }

  function handleStop() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const conv: Conversation = {
      id: Date.now().toString(),
      title: "Nova Gravação",
      subtitle: "Recém gravado",
      date: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }),
      dateShort: "Agora mesmo",
      duration: timer,
      durationSeconds: 0,
      status: "processing",
      speakers: [{ id: "henry", name: "Henry Costa", initials: "HC", color: "#9B59D0", talkTimePercent: 50, wordCount: 120 }],
      transcript: [],
      actionItems: [],
      highlights: [],
    };
    addConversation(conv);
    router.back();
  }

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  const SPEAKERS_DISPLAY = [
    { name: "Henry", initials: "HC", color: "#9B59D0" },
    { name: "Sarah", initials: "SK", color: "#34C759" },
    { name: "Marcus", initials: "ML", color: "#FF9500" },
  ];

  return (
    <GlassBackground>
      <View style={[styles.root]}>
        <View style={[styles.header, { paddingTop: topPad }]}>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: "rgba(175,82,222,0.08)" }]}
            onPress={() => router.back()}
          >
            <Feather name="x" size={18} color={colors.heading} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.heading }]}>
            {isRecording ? "Gravando" : "Pronto para gravar"}
          </Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.body}>
          <View style={styles.timerBlock}>
            <Text style={[styles.timer, { color: colors.heading }]}>{timer}</Text>
            {isRecording && !isPaused && (
              <View style={styles.liveRow}>
                <Animated.View style={[styles.liveDot, { backgroundColor: "#FF3B30", transform: [{ scale: pulseAnim }] }]} />
                <Text style={[styles.liveLabel, { color: "#FF3B30" }]}>AO VIVO</Text>
              </View>
            )}
          </View>

          <View style={styles.waveformRow}>
            <WaveformBars
              isActive={isRecording && !isPaused}
              barCount={30}
              color={isRecording ? colors.primary : "rgba(175,82,222,0.2)"}
              height={52}
            />
          </View>

          {isRecording && (
            <View style={styles.speakerRow}>
              {SPEAKERS_DISPLAY.map((sp, i) => {
                const active = i === activeSpeaker % SPEAKERS_DISPLAY.length;
                return (
                  <View
                    key={sp.name}
                    style={[styles.speakerChip, {
                      backgroundColor: active ? sp.color + "18" : "rgba(175,82,222,0.06)",
                      borderColor: active ? sp.color + "50" : "rgba(175,82,222,0.12)",
                      borderWidth: 1,
                    }]}
                  >
                    <Avatar initials={sp.initials} color={sp.color} size={20} />
                    <Text style={[styles.speakerChipName, { color: active ? sp.color : colors.bodyText, fontWeight: active ? "500" : "400" }]}>
                      {sp.name}
                    </Text>
                    {active && <WaveformBars isActive barCount={4} color={sp.color} height={12} compact />}
                  </View>
                );
              })}
            </View>
          )}

          {isRecording && visibleLines.length > 0 && (
            <GlassCard style={{ gap: 8 }}>
              <View style={styles.transcriptLabel}>
                <Feather name="file-text" size={12} color={colors.primary} />
                <Text style={[styles.transcriptLabelText, { color: colors.primary }]}>Transcrição ao vivo</Text>
              </View>
              <ScrollView style={{ maxHeight: 160 }} showsVerticalScrollIndicator={false}>
                {visibleLines.map((lineIdx) => {
                  const line = LIVE_LINES[lineIdx];
                  if (!line) return null;
                  return (
                    <View key={lineIdx} style={styles.transcriptLine}>
                      <Avatar initials={line.initials} color={line.color} size={22} />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.segName, { color: line.color }]}>{line.speaker}</Text>
                        <Text style={[styles.segText, { color: colors.bodyText }]}>{line.text}</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </GlassCard>
          )}

          {!isRecording && (
            <View style={styles.hints}>
              {[
                "Identifica participantes automaticamente",
                "Transcrição em tempo real",
                "Itens de ação extraídos ao finalizar",
              ].map((h) => (
                <View key={h} style={styles.hintRow}>
                  <View style={[styles.hintDot, { backgroundColor: "rgba(52,199,89,0.12)" }]}>
                    <Feather name="check" size={12} color="#34C759" />
                  </View>
                  <Text style={[styles.hintText, { color: colors.bodyText }]}>{h}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={[styles.controls, { paddingBottom: bottomPad }]}>
          {!isRecording ? (
            <TouchableOpacity
              style={[
                styles.bigBtn,
                { backgroundColor: "#FF3B30" },
                Platform.OS === "ios" && { shadowColor: "#FF3B30", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 },
              ]}
              onPress={handleStart}
              activeOpacity={0.92}
            >
              <Feather name="mic" size={28} color="#fff" />
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
                  Platform.OS === "ios" && { shadowColor: isPaused ? colors.primary : "#FF3B30", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 },
                ]}
                onPress={handlePause}
                activeOpacity={0.92}
              >
                <Feather name={isPaused ? "mic" : "pause"} size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.controlBtn, { backgroundColor: "rgba(175,82,222,0.10)" }]}>
                <Feather name="bookmark" size={20} color={colors.primary} />
                <Text style={[styles.controlBtnLabel, { color: colors.primary }]}>Marcar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12 },
  closeBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontWeight: "600" },
  body: { flex: 1, paddingHorizontal: 20, gap: 20 },
  timerBlock: { alignItems: "center", gap: 8 },
  timer: { fontSize: 60, fontWeight: "300", letterSpacing: -2 },
  liveRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  waveformRow: { alignItems: "center" },
  speakerRow: { flexDirection: "row", gap: 8, justifyContent: "center", flexWrap: "wrap" },
  speakerChip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 9999, gap: 6 },
  speakerChipName: { fontSize: 13 },
  transcriptLabel: { flexDirection: "row", alignItems: "center", gap: 6 },
  transcriptLabelText: { fontSize: 12, fontWeight: "600" },
  transcriptLine: { flexDirection: "row", gap: 10, marginBottom: 12 },
  segName: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  segText: { fontSize: 13, lineHeight: 19 },
  hints: { gap: 12 },
  hintRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  hintDot: { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  hintText: { fontSize: 14 },
  controls: { paddingHorizontal: 20, alignItems: "center", paddingTop: 12 },
  bigBtn: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  activeControls: { flexDirection: "row", alignItems: "center", gap: 30 },
  controlBtn: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", gap: 4 },
  controlBtnLabel: { fontSize: 10, fontWeight: "500" },
});
