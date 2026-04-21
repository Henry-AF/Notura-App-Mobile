import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  dark?: boolean;
  noPad?: boolean;
  noShadow?: boolean;
}

export function GlassCard({ children, style, intensity = 55, dark = false, noPad = false, noShadow = false }: GlassCardProps) {
  const colors = useColors();

  const shadowStyle: ViewStyle = noShadow ? {} : Platform.OS === "ios" ? {
    shadowColor: "rgb(100,60,180)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  } : Platform.OS === "android" ? { elevation: 3 } : {};

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={intensity}
        tint={dark ? "dark" : "systemUltraThinMaterialLight"}
        style={[
          styles.base,
          shadowStyle,
          {
            borderColor: dark ? "rgba(255,255,255,0.12)" : colors.glassBorder,
            backgroundColor: dark ? "rgba(61,26,110,0.9)" : undefined,
          },
          !noPad && styles.pad,
          style,
        ]}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.base,
        shadowStyle,
        {
          backgroundColor: dark ? colors.darkCard : colors.glassBg,
          borderColor: dark ? "rgba(255,255,255,0.12)" : colors.glassBorder,
        },
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
