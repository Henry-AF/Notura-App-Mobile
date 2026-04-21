import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import React, { useRef } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RecordFAB } from "@/components/RecordFAB";
import { useColors } from "@/hooks/useColors";

const TABS = [
  { name: "/(tabs)/index", label: "Início", icon: "home" },
  { name: "/(tabs)/search", label: "Buscar", icon: "search" },
  { name: "/(tabs)/spaces", label: "Espaços", icon: "folder" },
  { name: "/(tabs)/analytics", label: "Análises", icon: "bar-chart-2" },
  { name: "/(tabs)/profile", label: "Perfil", icon: "user" },
] as const;

const ACTIVE = "#9B59D0";
const INACTIVE = "#C4B8D8";

function TabButton({ tab, active }: { tab: typeof TABS[number]; active: boolean }) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  function handlePress() {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
    router.push(tab.name as any);
  }

  return (
    <TouchableOpacity style={styles.tabBtn} onPress={handlePress} activeOpacity={0.7}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Feather name={tab.icon as any} size={22} color={active ? ACTIVE : INACTIVE} />
      </Animated.View>
      <Text style={[styles.tabLabel, { color: active ? ACTIVE : INACTIVE }]}>{tab.label}</Text>
    </TouchableOpacity>
  );
}

export function GlassTabBar() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const leftTabs = TABS.slice(0, 2);
  const rightTabs = TABS.slice(3, 5);

  function isActive(name: string) {
    if (name === "/(tabs)/index") return pathname === "/" || pathname === "/index" || pathname === "/(tabs)" || pathname === "/(tabs)/index";
    return pathname.startsWith(name.replace("/(tabs)", ""));
  }

  const barContent = (
    <>
      <View style={styles.left}>
        {leftTabs.map((tab) => (
          <TabButton key={tab.name} tab={tab} active={isActive(tab.name)} />
        ))}
      </View>
      <View style={styles.center}>
        <RecordFAB />
      </View>
      <View style={styles.right}>
        {rightTabs.map((tab) => (
          <TabButton key={tab.name} tab={tab} active={isActive(tab.name)} />
        ))}
      </View>
    </>
  );

  if (Platform.OS === "ios") {
    return (
      <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
        <BlurView
          intensity={80}
          tint="systemUltraThinMaterialLight"
          style={[styles.bar, { borderTopColor: "rgba(175,82,222,0.12)" }]}
        >
          {barContent}
        </BlurView>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: insets.bottom },
      ]}
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: "rgba(255,255,255,0.92)",
            borderTopColor: "rgba(175,82,222,0.12)",
          },
          Platform.OS === "android" && { elevation: 12 },
        ]}
      >
        {barContent}
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
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },
  left: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  center: { width: 90, alignItems: "center", marginTop: -22 },
  right: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  tabBtn: { flex: 1, alignItems: "center", gap: 3, paddingHorizontal: 4 },
  tabLabel: { fontSize: 10, fontWeight: "500" },
});
