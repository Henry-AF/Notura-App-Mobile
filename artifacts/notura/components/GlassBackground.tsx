import React from "react";
import { Platform, StyleSheet, View } from "react-native";

interface GlassBackgroundProps {
  children: React.ReactNode;
}

export function GlassBackground({ children }: GlassBackgroundProps) {
  if (Platform.OS === "web") {
    return (
      <View style={styles.root}>
        <View style={styles.webGradient as any} />
        <View style={StyleSheet.absoluteFill}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: "#FFFFFF" }]}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  webGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(200,160,255,0.20) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(160,120,255,0.14) 0%, transparent 55%)",
  } as any,
  blob1: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    top: -100,
    left: -80,
    backgroundColor: "rgba(200,160,255,0.20)",
  },
  blob2: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    bottom: 120,
    right: -70,
    backgroundColor: "rgba(160,120,255,0.15)",
  },
  blob3: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: "45%",
    left: "30%",
    backgroundColor: "rgba(175,82,222,0.07)",
  },
});
