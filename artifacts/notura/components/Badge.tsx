import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

type BadgeVariant = "primary" | "success" | "warning" | "error" | "neutral" | "info";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({ label, variant = "neutral", dot = false }: BadgeProps) {
  const colors = useColors();

  const styles = getVariantStyles(variant, colors);

  return (
    <View style={[badgeStyles.container, { backgroundColor: styles.bg }]}>
      {dot && (
        <View style={[badgeStyles.dot, { backgroundColor: styles.dotColor }]} />
      )}
      <Text style={[badgeStyles.text, { color: styles.text }]}>{label}</Text>
    </View>
  );
}

function getVariantStyles(variant: BadgeVariant, colors: ReturnType<typeof useColors>) {
  switch (variant) {
    case "primary":
      return {
        bg: "rgba(83,65,205,0.12)",
        text: colors.brand700,
        dotColor: colors.primary,
      };
    case "success":
      return {
        bg: colors.successBg,
        text: "#085041",
        dotColor: colors.success,
      };
    case "warning":
      return {
        bg: colors.warningBg,
        text: "#633806",
        dotColor: colors.warning,
      };
    case "error":
      return {
        bg: colors.errorBg,
        text: "#A32D2D",
        dotColor: colors.error,
      };
    case "info":
      return {
        bg: colors.infoBg,
        text: colors.info,
        dotColor: colors.info,
      };
    default:
      return {
        bg: colors.secondary,
        text: colors.gray600,
        dotColor: colors.gray400,
      };
  }
}

const badgeStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
