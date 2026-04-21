import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, sublabel, icon }: StatCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {icon && <View style={styles.iconRow}>{icon}</View>}
      <Text style={[styles.value, { color: colors.foreground }]}>
        {value}
      </Text>
      <Text style={[styles.label, { color: colors.gray500 }]}>{label}</Text>
      {sublabel && (
        <Text style={[styles.sublabel, { color: colors.success }]}>
          {sublabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 14,
    gap: 3,
  },
  iconRow: {
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 12,
    lineHeight: 17,
  },
  sublabel: {
    fontSize: 11,
    fontWeight: "500",
  },
});
