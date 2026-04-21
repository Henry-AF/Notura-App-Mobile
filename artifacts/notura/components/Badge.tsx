import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

type BadgeVariant = "primary" | "success" | "warning" | "error" | "neutral" | "info" | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({ label, variant = "neutral", dot = false }: BadgeProps) {
  const colors = useColors();
  const s = getVariantStyles(variant, colors);

  return (
    <View style={[styles.container, { backgroundColor: s.bg }]}>
      {dot && <View style={[styles.dot, { backgroundColor: s.dotColor }]} />}
      <Text style={[styles.text, { color: s.text }]}>{label}</Text>
    </View>
  );
}

function getVariantStyles(variant: BadgeVariant, colors: ReturnType<typeof useColors>) {
  switch (variant) {
    case "primary":
      return { bg: colors.brandSubtle, text: colors.primary, dotColor: colors.primary };
    case "success":
      return { bg: colors.successBg, text: colors.success, dotColor: colors.success };
    case "warning":
      return { bg: colors.warningBg, text: colors.warning, dotColor: colors.warning };
    case "error":
      return { bg: colors.errorBg, text: colors.error, dotColor: colors.error };
    case "info":
      return { bg: colors.infoBg, text: colors.info, dotColor: colors.info };
    default:
      return { bg: colors.secondary, text: colors.gray500, dotColor: colors.gray400 };
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
});
