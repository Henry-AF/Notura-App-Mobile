import React from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  dark?: boolean;
  tinted?: boolean;
  noPad?: boolean;
  noShadow?: boolean;
  intensity?: number;
}

export function GlassCard({ children, style, dark = false, tinted = false, noPad = false, noShadow = false }: GlassCardProps) {
  const colors = useColors();

  const shadowStyle: ViewStyle = noShadow ? {} : Platform.OS === "ios" ? {
    shadowColor: "#AF52DE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  } : Platform.OS === "android" ? { elevation: 2 } : {};

  const bgColor = dark
    ? colors.darkCard
    : tinted
    ? "rgba(175,82,222,0.07)"
    : colors.card;

  const borderColor = dark
    ? "rgba(255,255,255,0.10)"
    : "rgba(175,82,222,0.10)";

  return (
    <View
      style={[
        styles.base,
        shadowStyle,
        { backgroundColor: bgColor, borderColor },
        !noPad && styles.pad,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  pad: {
    padding: 16,
  },
});
