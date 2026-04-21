import React from "react";
import { Platform, StyleSheet, View } from "react-native";

interface GlassBackgroundProps {
  children: React.ReactNode;
}

export function GlassBackground({ children }: GlassBackgroundProps) {
  if (Platform.OS === "web") {
    return (
      <View
        style={[
          styles.root,
          {
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(200,160,255,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(160,120,255,0.12) 0%, transparent 55%), #FFFFFF",
          } as any,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: "#FFFFFF" }]}>
      <View
        style={[
          styles.blob1,
          { backgroundColor: "rgba(200,160,255,0.22)" },
        ]}
      />
      <View
        style={[
          styles.blob2,
          { backgroundColor: "rgba(160,120,255,0.16)" },
        ]}
      />
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  blob1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    top: -80,
    left: -60,
  },
  blob2: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    bottom: 100,
    right: -60,
  },
});
