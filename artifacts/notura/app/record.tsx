import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { WaveformBars } from "@/components/WaveformBars";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { Conversation } from "@/lib/mockData";

const LIVE_TRANSCRIPT_LINES = [
  { speaker: "Henry Costa", initials: "HC", color: "#5341CD", text: "Let's kick off the weekly sync. First item on the agenda is the mobile release." },
  { speaker: "Sarah Kim", initials: "SK", color: "#1D9E75", text: "We're on track for May 15th. The audio module fix landed yesterday." },
  { speaker: "Marcus Lee", initials: "ML", color: "#EF9F27", text: "Great news. What's the status on the App Store submission checklist?" },
  { speaker: "Henry Costa", initials: "HC", color: "#5341CD", text: "About 80% done. We still need the privacy policy update and screenshots." },
  { speaker: "Sarah Kim", initials: "SK", color: "#1D9E75", text: "I can take care of the screenshots today. Privacy policy is with legal." },
  { speaker: "Marcus Lee", initials: "ML", color: "#EF9F27", text: "Legal said two more days. We should be clear to submit by end of week." },
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
  const [title, setTitle] = useState("New Recording");
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [activeSpeaker, setActiveSpeaker] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timer = useTimer(isRecording && !isPaused);

  useEffect(() => {
    if (!isRecording || isPaused) return;
    const id = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev.length >= LIVE_TRANSCRIPT_LINES.length) return prev;
        const next = [...prev, prev.length];
        setActiveSpeaker(prev.length % LIVE_TRANSCRIPT_LINES.length);
        return next;
      });
    }, 2800);
    return () => clearInterval(id);
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (!isRecording) return;
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [isRecording]);

  function handleStart() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsRecording(true);
    setIsPaused(false);
    setVisibleLines([]);
  }

  function handlePause() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPaused(!isPaused);
  }

  function handleStop() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const conv: Conversation = {
      id: Date.now().toString(),
      title: title || "New Recording",
      subtitle: "Just recorded",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      dateShort: "Just now",
      duration: timer,
      durationSeconds: 0,
      status: "processing",
      speakers: [
        { id: "henry", name: "Henry Costa", initials: "HC", color: "#5341CD", talkTimePercent: 50, wordCount: 120 },
      ],
      transcript: [],
      actionItems: [],
      highlights: [],
    };
    addConversation(conv);
    router.back();
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom + 16;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: colors.secondary }]}
          onPress={() => router.back()}
        >
          <Feather name="x" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {isRecording ? "Recording" : "Ready to record"}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.body}>
        <View style={styles.timerSection}>
          <Text style={[styles.timer, { color: colors.foreground }]}>{timer}</Text>
          {isRecording && !isPaused && (
            <View style={styles.liveChip}>
              <Animated.View
                style={[
                  styles.liveDot,
                  { backgroundColor: colors.error, transform: [{ scale: pulseAnim }] },
                ]}
              />
              <Text style={[styles.liveText, { color: colors.error }]}>LIVE</Text>
            </View>
          )}
        </View>

        <View style={styles.waveformSection}>
          <WaveformBars
            isActive={isRecording && !isPaused}
            barCount={32}
            color={isRecording ? colors.error : colors.gray300}
            height={56}
          />
        </View>

        {isRecording && (
          <View style={styles.speakerChips}>
            {[
              { name: "Henry", initials: "HC", color: "#5341CD" },
              { name: "Sarah", initials: "SK", color: "#1D9E75" },
              { name: "Marcus", initials: "ML", color: "#EF9F27" },
            ].map((sp, i) => (
              <View
                key={sp.name}
                style={[
                  styles.speakerChip,
                  {
                    backgroundColor: i === activeSpeaker % 3
                      ? sp.color + "22"
                      : colors.secondary,
                    borderColor: i === activeSpeaker % 3 ? sp.color : "transparent",
                    borderWidth: 1,
                  },
                ]}
              >
                <Avatar initials={sp.initials} color={sp.color} size={20} />
                <Text style={[styles.chipName, { color: i === activeSpeaker % 3 ? sp.color : colors.gray500 }]}>
                  {sp.name}
                </Text>
                {i === activeSpeaker % 3 && (
                  <WaveformBars isActive barCount={5} color={sp.color} height={14} compact />
                )}
              </View>
            ))}
          </View>
        )}

        {isRecording && visibleLines.length > 0 && (
          <View style={[styles.transcriptCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.transcriptHeader}>
              <Feather name="file-text" size={13} color={colors.primary} />
              <Text style={[styles.transcriptLabel, { color: colors.primary }]}>
                Live Transcript
              </Text>
            </View>
            <ScrollView style={styles.transcriptScroll} showsVerticalScrollIndicator={false}>
              {visibleLines.map((lineIdx) => {
                const line = LIVE_TRANSCRIPT_LINES[lineIdx];
                if (!line) return null;
                return (
                  <View key={lineIdx} style={styles.transcriptLine}>
                    <Avatar initials={line.initials} color={line.color} size={24} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.segSpeaker, { color: line.color }]}>
                        {line.speaker}
                      </Text>
                      <Text style={[styles.segText, { color: colors.gray700 }]}>
                        {line.text}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {!isRecording && (
          <View style={styles.hints}>
            {[
              "AI identifies speakers automatically",
              "Transcribed in real-time",
              "Action items extracted on finish",
            ].map((hint) => (
              <View key={hint} style={styles.hintRow}>
                <Feather name="check-circle" size={14} color={colors.success} />
                <Text style={[styles.hintText, { color: colors.gray500 }]}>{hint}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={[styles.controls, { paddingBottom: bottomPad }]}>
        {!isRecording ? (
          <TouchableOpacity
            style={[styles.recordBtn, { backgroundColor: colors.error }]}
            onPress={handleStart}
            activeOpacity={0.85}
          >
            <Feather name="mic" size={28} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.activeControls}>
            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.secondary }]}
              onPress={handleStop}
            >
              <Feather name="square" size={22} color={colors.error} />
              <Text style={[styles.controlLabel, { color: colors.error }]}>Stop</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.recordBtn,
                { backgroundColor: isPaused ? colors.primary : colors.error },
              ]}
              onPress={handlePause}
              activeOpacity={0.85}
            >
              <Feather name={isPaused ? "mic" : "pause"} size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlBtn, { backgroundColor: colors.secondary }]}
            >
              <Feather name="bookmark" size={22} color={colors.primary} />
              <Text style={[styles.controlLabel, { color: colors.primary }]}>Mark</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "600" },
  body: { flex: 1, paddingHorizontal: 20, gap: 20 },
  timerSection: { alignItems: "center", gap: 8 },
  timer: { fontSize: 56, fontWeight: "300", letterSpacing: -2, fontVariant: ["tabular-nums"] },
  liveChip: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { fontSize: 11, fontWeight: "700", letterSpacing: 1 },
  waveformSection: { alignItems: "center" },
  speakerChips: { flexDirection: "row", gap: 8, justifyContent: "center", flexWrap: "wrap" },
  speakerChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 6,
  },
  chipName: { fontSize: 12, fontWeight: "500" },
  transcriptCard: {
    borderRadius: 16,
    borderWidth: 0.5,
    padding: 14,
    flex: 1,
    maxHeight: 200,
    gap: 10,
  },
  transcriptHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  transcriptLabel: { fontSize: 12, fontWeight: "600" },
  transcriptScroll: { flex: 1 },
  transcriptLine: { flexDirection: "row", gap: 10, marginBottom: 12 },
  segSpeaker: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  segText: { fontSize: 13, lineHeight: 18 },
  hints: { gap: 10 },
  hintRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  hintText: { fontSize: 14 },
  controls: { padding: 20, alignItems: "center", gap: 20 },
  recordBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E24B4A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  activeControls: { flexDirection: "row", alignItems: "center", gap: 28 },
  controlBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: 16,
    gap: 4,
  },
  controlLabel: { fontSize: 10, fontWeight: "500" },
});
