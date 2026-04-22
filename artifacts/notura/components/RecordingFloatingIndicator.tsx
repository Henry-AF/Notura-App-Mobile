import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";

import { WaveformBars } from "@/components/WaveformBars";
import { useColors } from "@/hooks/useColors";
import { formatRecordingTimer, useRecordingStore } from "@/stores/useRecordingStore";

export function RecordingFloatingIndicator() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { sheetState, status, elapsedSeconds, openRecordingSheet } = useRecordingStore(useShallow((state) => ({
    sheetState: state.sheetState,
    status: state.status,
    elapsedSeconds: state.elapsedSeconds,
    openRecordingSheet: state.openRecordingSheet,
  })));
  const isSheetHidden = sheetState === "hidden";

  if (status === "idle" || !isSheetHidden) return null;

  const isPaused = status !== "recording";

  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={openRecordingSheet}
        style={[
          styles.touchable,
          {
            bottom: insets.bottom + 74,
            backgroundColor: "#FFFFFF",
            borderColor: isPaused ? colors.border : "rgba(255,59,48,0.20)",
          },
          Platform.OS === "ios" && styles.shadowIos,
          Platform.OS === "android" && styles.shadowAndroid,
          Platform.OS === "web" && styles.shadowWeb,
        ]}
      >
        <View style={styles.content}>
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: isPaused ? "rgba(175,82,222,0.10)" : "rgba(255,59,48,0.10)" },
            ]}
          >
            <Feather name={isPaused ? "pause" : "mic"} size={16} color={isPaused ? colors.primary : "#FF3B30"} />
          </View>

          <View style={styles.body}>
            <Text style={[styles.title, { color: colors.heading }]}>
              {isPaused ? "Gravação pausada" : "Microfone gravando"}
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.timer, { color: isPaused ? colors.primary : "#FF3B30" }]}>
                {formatRecordingTimer(elapsedSeconds)}
              </Text>
              <WaveformBars
                isActive={status === "recording"}
                barCount={8}
                color={isPaused ? colors.primary : "#FF3B30"}
                height={14}
                compact
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  touchable: {
    position: "absolute",
    alignSelf: "center",
    minWidth: 220,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  shadowIos: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  shadowAndroid: {
    elevation: 6,
  },
  shadowWeb: {
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
  } as any,
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    gap: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timer: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
