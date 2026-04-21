import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface WaveformBarsProps {
  isActive?: boolean;
  barCount?: number;
  color?: string;
  height?: number;
  compact?: boolean;
}

export function WaveformBars({
  isActive = true,
  barCount = 24,
  color,
  height = 48,
  compact = false,
}: WaveformBarsProps) {
  const colors = useColors();
  const barColor = color ?? colors.primary;
  const bars = useRef<Animated.Value[]>(
    Array.from({ length: barCount }, () => new Animated.Value(0.15))
  ).current;

  useEffect(() => {
    if (!isActive) {
      bars.forEach((b) => Animated.spring(b, { toValue: 0.15, useNativeDriver: false }).start());
      return;
    }

    const animations = bars.map((bar, i) => {
      const randomHeight = () => 0.15 + Math.random() * 0.85;
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: randomHeight(),
            duration: 200 + Math.random() * 300,
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: randomHeight(),
            duration: 200 + Math.random() * 300,
            useNativeDriver: false,
          }),
        ])
      );
      const timeout = setTimeout(() => loop.start(), i * 30);
      return { loop, timeout };
    });

    return () => {
      animations.forEach(({ loop, timeout }) => {
        clearTimeout(timeout);
        loop.stop();
      });
    };
  }, [isActive]);

  const containerHeight = compact ? height * 0.6 : height;

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      {bars.map((bar, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              backgroundColor: barColor,
              width: compact ? 2 : 3,
              height: bar.interpolate({
                inputRange: [0, 1],
                outputRange: [compact ? 4 : 4, containerHeight],
              }),
              opacity: isActive ? bar.interpolate({ inputRange: [0.1, 1], outputRange: [0.4, 1] }) : 0.25,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  bar: {
    borderRadius: 2,
  },
});
