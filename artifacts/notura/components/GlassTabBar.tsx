import { Feather } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import React, { useRef } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRecordingStore } from "@/stores/useRecordingStore";

// Design tokens (8. Bottom Navigation Bar)
const PRIMARY  = "#AF52DE";
const BG_PAGE  = "#F9F3FD";
const INACTIVE = "#B0B0B0";
const WHITE    = "#FFFFFF";
const BORDER   = "#E5D6F5";

type TabDef = {
  name: string;
  match: string;
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  isRecord?: boolean;
};

const TABS: TabDef[] = [
  { name: "/", match: "/(tabs)/index", label: "Início", icon: "home" },
  { name: "/(tabs)/search", match: "/(tabs)/search", label: "Buscar", icon: "search" },
  { name: "/record", match: "/record", label: "Gravar", icon: "mic", isRecord: true },
  { name: "/(tabs)/analytics", match: "/(tabs)/analytics", label: "Análises", icon: "bar-chart-2" },
  { name: "/(tabs)/profile", match: "/(tabs)/profile", label: "Perfil", icon: "user" },
];

function TabButton({ tab, active }: { tab: TabDef; active: boolean }) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const openRecordingSheet = useRecordingStore((state) => state.openRecordingSheet);
  const status = useRecordingStore((state) => state.status);
  const showRecordingDot = tab.isRecord && status === "recording";

  function handlePress() {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();

    if (tab.isRecord) {
      openRecordingSheet();
      return;
    }
    router.push(tab.name as any);
  }

  // Botão central elevado — SEM label, conforme spec
  if (tab.isRecord) {
    return (
      <TouchableOpacity style={styles.recordTabBtn} onPress={handlePress} activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.recordBtn,
            { transform: [{ scale: scaleAnim }] },
            Platform.OS === "ios" && {
              shadowColor: PRIMARY,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
            },
            Platform.OS === "android" && { elevation: 6 },
            Platform.OS === "web" && { boxShadow: "0 6px 16px rgba(175,82,222,0.35)" } as any,
          ]}
        >
          <Feather name="mic" size={24} color={WHITE} />
          {showRecordingDot && <View style={styles.recordingDot} />}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  // Itens normais: ativo = cor PRIMARY + fundo BG_PAGE + border-radius 10px
  return (
    <TouchableOpacity
      style={[styles.tabBtn, active && styles.tabBtnActive]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Feather name={tab.icon} size={20} color={active ? PRIMARY : INACTIVE} />
      </Animated.View>
      <Text style={[styles.tabLabel, { color: active ? PRIMARY : INACTIVE }]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );
}

export function GlassTabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  function isActive(tab: TabDef) {
    if (tab.match === "/(tabs)/index") {
      return (
        pathname === "/" ||
        pathname === "/index" ||
        pathname === "/(tabs)" ||
        pathname === "/(tabs)/index"
      );
    }
    if (tab.match === "/(tabs)/search")    return pathname === "/search"    || pathname === "/(tabs)/search";
    if (tab.match === "/(tabs)/analytics") return pathname === "/analytics" || pathname === "/(tabs)/analytics";
    if (tab.match === "/(tabs)/profile")   return pathname === "/profile"   || pathname === "/(tabs)/profile";
    return pathname === tab.match;
  }

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.bar}>
        {TABS.map((tab) => (
          <TabButton key={tab.label} tab={tab} active={isActive(tab)} />
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
  // background: #FFFFFF | border-top: 1px solid #E5D6F5 | height: 64px
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    height: 64,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  // Item ativo: background #F9F3FD, border-radius 10px, padding 4px 12px
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: BG_PAGE,
  },
  // font-size label: 11px
  tabLabel: {
    fontSize: 11,
    fontWeight: "400",
  },
  // Gravar: ocupa slot central, alinha o FAB elevado
  recordTabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // background: #AF52DE | 56x56 | border-radius 50% | translateY -16px
  recordBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -32,  // sobe acima da barra (~translateY -16 relativo ao centro)
  },
  recordingDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
    borderWidth: 1.5,
    borderColor: WHITE,
  },
});

