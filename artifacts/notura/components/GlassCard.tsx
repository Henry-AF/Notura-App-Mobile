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
}

export function GlassCard({ children, style, intensity = 60, dark = false, noPad = false }: GlassCardProps) {
  const colors = useColors();

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={intensity}
        tint={dark ? "dark" : "systemUltraThinMaterialLight"}
        style={[
          styles.base,
          {
            borderColor: dark ? "rgba(255,255,255,0.12)" : colors.glassBorder,
            backgroundColor: dark ? "rgba(61,26,110,0.85)" : "transparent",
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
        {
          backgroundColor: dark ? colors.darkCard : colors.glassBg,
          borderColor: dark ? "rgba(255,255,255,0.12)" : colors.glassBorder,
          ...shadowStyle(),
        },
        !noPad && styles.pad,
        style,
      ]}
    >
      {children}
    </View>
  );
}

function shadowStyle() {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "rgb(100,60,180)",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
    };
  }
  if (Platform.OS === "android") {
    return { elevation: 3 };
  }
  return {};
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
