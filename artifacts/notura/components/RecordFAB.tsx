import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export function RecordFAB() {
  const colors = useColors();
  const router = useRouter();
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.5)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const ring2Opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animate = (scale: Animated.Value, opacity: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1.65, duration: 1800, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 1800, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
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
        activeOpacity={0.86}
        style={[
          styles.btn,
          Platform.OS === "ios" && {
            shadowColor: "#7B2FBE",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.45,
            shadowRadius: 22,
          },
          Platform.OS === "android" && { elevation: 12 },
        ]}
      >
        <Feather name="mic" size={26} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={[styles.label, { color: colors.primary }]}>Gravar</Text>
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
    backgroundColor: "rgba(175,82,222,0.28)",
  },
  btn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9B59D0",
    ...(Platform.OS === "web" ? { backgroundImage: "linear-gradient(135deg,#AF52DE,#7B2FBE)" } as any : {}),
  },
  label: { fontSize: 11, fontWeight: "500", marginTop: 5 },
});
