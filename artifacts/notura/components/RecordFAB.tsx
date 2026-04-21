import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export function RecordFAB() {
  const colors = useColors();
  const router = useRouter();
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 1800,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

    const a1 = pulse(ring1, 0);
    const a2 = pulse(ring2, 900);
    a1.start();
    a2.start();
    return () => {
      a1.stop();
      a2.stop();
    };
  }, []);

  const ringStyle = (anim: Animated.Value) => ({
    position: "absolute" as const,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(175,82,222,0.30)",
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.65] }) }],
    opacity: anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.6, 0.15, 0] }),
  });

  return (
    <View style={styles.wrap}>
      <Animated.View style={ringStyle(ring1)} />
      <Animated.View style={ringStyle(ring2)} />
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          router.push("/record");
        }}
        activeOpacity={0.88}
        style={[
          styles.btn,
          Platform.OS === "ios" && {
            shadowColor: "#7B2FBE",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.45,
            shadowRadius: 20,
          },
          Platform.OS === "android" && { elevation: 10 },
        ]}
      >
        <Feather name="mic" size={26} color="#fff" />
      </TouchableOpacity>
      <Text style={[styles.label, { color: colors.primary }]}>Gravar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingBottom: 4,
  },
  btn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9B59D0",
    backgroundImage: Platform.OS === "web"
      ? "linear-gradient(135deg, #AF52DE, #7B2FBE)" as any
      : undefined,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
});
