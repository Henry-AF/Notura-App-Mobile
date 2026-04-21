import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/Badge";

interface InsightCardProps {
  title: string;
  text: string;
  badge?: string;
}

export function InsightCard({ title, text, badge }: InsightCardProps) {
  return (
    <LinearGradient
      colors={["#5341CD", "#3526A0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Feather name="zap" size={16} color="#fff" />
        </View>
        <Text style={styles.title}>{title}</Text>
        {badge && <Badge label={badge} variant="neutral" />}
      </View>
      <Text style={styles.text}>{text}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  text: {
    fontSize: 13,
    color: "rgba(255,255,255,0.88)",
    lineHeight: 20,
  },
});
