import { Feather } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import React, { useRef } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRecordingStore } from "@/stores/useRecordingStore";

const TABS = [
  { name: "/", match: "/(tabs)/index", label: "Início", icon: "home" },
  { name: "/(tabs)/search", match: "/(tabs)/search", label: "Reuniões", icon: "list" },
  { name: "/record", match: "/record", label: "Gravar", icon: "plus-circle" },
] as const;

const ACTIVE = "#AF52DE";
const INACTIVE = "#C0BDD0";

function TabButton({ tab, active }: { tab: typeof TABS[number]; active: boolean }) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const openRecordingSheet = useRecordingStore((state) => state.openRecordingSheet);
  const status = useRecordingStore((state) => state.status);
  const isRecordingTab = tab.match === "/record";
  const showRecordingDot = isRecordingTab && status === "recording";

  function handlePress() {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();

    if (tab.match === "/record") {
      openRecordingSheet();
      return;
    }

    router.push(tab.name as any);
  }

  return (
    <TouchableOpacity style={styles.tabBtn} onPress={handlePress} activeOpacity={0.7}>
      <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
        <Feather
          name={tab.icon as any}
          size={22}
          color={active ? ACTIVE : INACTIVE}
        />
        {showRecordingDot ? <View style={styles.recordingDot} /> : null}
      </Animated.View>
      <Text style={[styles.tabLabel, { color: active ? ACTIVE : INACTIVE }]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
}

export function GlassTabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  function isActive(match: string) {
    if (match === "/(tabs)/index") {
      return pathname === "/" || pathname === "/index" || pathname === "/(tabs)" || pathname === "/(tabs)/index";
    }
    if (match === "/(tabs)/search") {
      return pathname === "/search" || pathname === "/(tabs)/search";
    }
    return pathname === match;
  }

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View
        style={[
          styles.bar,
          Platform.OS === "android" && { elevation: 8 },
          Platform.OS === "web" && { boxShadow: "0 -1px 0 rgba(175,82,222,0.10)" } as any,
        ]}
      >
        {TABS.map((tab) => (
          <TabButton key={tab.label} tab={tab} active={isActive(tab.match)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(175,82,222,0.10)",
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  tabBtn: { flex: 1, alignItems: "center", gap: 3, paddingHorizontal: 4 },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 30,
  },
  tabLabel: { fontSize: 10, fontWeight: "500" },
  recordingDot: {
    marginTop: 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF3B30",
  },
});
