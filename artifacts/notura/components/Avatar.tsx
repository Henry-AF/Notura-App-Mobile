import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AvatarProps {
  initials: string;
  color?: string;
  size?: number;
}

export function Avatar({ initials, color = "#5341CD", size = 36 }: AvatarProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color + "22",
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          { color, fontSize: size * 0.38 },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
