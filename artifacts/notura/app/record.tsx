import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppNavbar } from "@/components/AppNavbar";
import { useColors } from "@/hooks/useColors";
import { useRecordingStore } from "@/stores/useRecordingStore";

export default function RecordScreen() {
  const colors = useColors();
  const router = useRouter();
  const openRecordingSheet = useRecordingStore((state) => state.openRecordingSheet);

  useEffect(() => {
    openRecordingSheet();
  }, [openRecordingSheet]);

  return (
    <View style={styles.root}>
      <AppNavbar title="Gravar" showBackButton />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.heading }]}>A gravação agora vive no sheet.</Text>
        <Text style={[styles.subtitle, { color: colors.bodyText }]}>
          Se você chegou aqui por um link antigo, reabra a sessão pelo botão abaixo ou volte para as abas.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => {
            openRecordingSheet();
            router.back();
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Abrir gravação</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: -0.8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  button: {
    alignSelf: "center",
    paddingHorizontal: 22,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
