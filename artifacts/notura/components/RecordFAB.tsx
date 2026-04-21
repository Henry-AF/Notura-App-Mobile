import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PRIMARY = "#AF52DE";

export function RecordFAB() {
  const router = useRouter();
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.7)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animate = (scale: Animated.Value, opacity: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1.5, duration: 1800, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 1800, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: delay === 0 ? 0.7 : 0.5, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );

    const a1 = animate(ring1Scale, ring1Opacity, 0);
    const a2 = animate(ring2Scale, ring2Opacity, 900);
    a1.start();
    a2.start();
    return () => { a1.stop(); a2.stop(); };
  }, []);

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.ring, { transform: [{ scale: ring1Scale }], opacity: ring1Opacity }]} />
      <Animated.View style={[styles.ring, { transform: [{ scale: ring2Scale }], opacity: ring2Opacity }]} />
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          router.push("/record");
        }}
        activeOpacity={0.88}
        style={[
          styles.btn,
          Platform.OS === "ios" && {
            shadowColor: PRIMARY,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 28,
          },
          Platform.OS === "android" && { elevation: 14 },
          Platform.OS === "web" && { boxShadow: "0 8px 28px rgba(175,82,222,0.35)" } as any,
        ]}
      >
        <Feather name="mic" size={26} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.label}>Gravar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  ring: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(175,82,222,0.25)",
  },
  btn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
  },
  label: { fontSize: 11, fontWeight: "600", color: PRIMARY, marginTop: 5 },
});
