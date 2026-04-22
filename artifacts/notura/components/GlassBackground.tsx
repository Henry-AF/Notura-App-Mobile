import React from "react";
import { StyleSheet, View } from "react-native";

interface GlassBackgroundProps {
  children: React.ReactNode;
}

export function GlassBackground({ children }: GlassBackgroundProps) {
  return (
    <View style={styles.root}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F9F3FD" },
});
