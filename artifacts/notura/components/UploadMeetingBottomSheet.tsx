import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { processLocalRecording } from "@/app/record-api";
import { useColors } from "@/hooks/useColors";
import { pickAudioFile, type PickedAudioFile } from "@/lib/audio-file-picker";
import { useMeetingCreationStore } from "@/stores/useMeetingCreationStore";

export function UploadMeetingBottomSheet() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(520)).current;
  const [shouldRender, setShouldRender] = useState(false);
  const [audioFile, setAudioFile] = useState<PickedAudioFile | null>(null);
  const [isPickingAudioFile, setIsPickingAudioFile] = useState(false);
  const [isProcessingAudioFile, setIsProcessingAudioFile] = useState(false);
  const activeSheet = useMeetingCreationStore((state) => state.activeSheet);
  const closeMeetingCreationSheet = useMeetingCreationStore((state) => state.closeMeetingCreationSheet);
  const isVisible = activeSheet === "upload";
  const isBusy = isPickingAudioFile || isProcessingAudioFile;

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      translateY.setValue(520);

      const frame = requestAnimationFrame(() => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 24,
          stiffness: 220,
          mass: 0.9,
        }).start();
      });

      return () => cancelAnimationFrame(frame);
    }

    if (!shouldRender) return;

    setAudioFile(null);

    Animated.spring(translateY, {
      toValue: 520,
      useNativeDriver: true,
      damping: 24,
      stiffness: 220,
      mass: 0.9,
    }).start(({ finished }) => {
      if (finished) {
        setShouldRender(false);
      }
    });
  }, [isVisible, shouldRender, translateY]);

  async function handlePickAudioFile() {
    if (isBusy) return;

    try {
      setIsPickingAudioFile(true);
      const file = await pickAudioFile();
      if (file) {
        setAudioFile(file);
      }
    } catch {
      Alert.alert("Não foi possível abrir seus arquivos", "Tente selecionar o áudio novamente.");
    } finally {
      setIsPickingAudioFile(false);
    }
  }

  async function handleProcessAudioFile() {
    if (!audioFile || isBusy) return;

    try {
      setIsProcessingAudioFile(true);
      const now = new Date();
      const result = await processLocalRecording({
        localUri: audioFile.uri,
        clientName: audioFile.name,
        meetingDate: now.toISOString().slice(0, 10),
      });

      closeMeetingCreationSheet();
      setAudioFile(null);
      router.push(`/conversation/${result.meetingId}`);
    } catch {
      Alert.alert("Não foi possível processar o arquivo", "Verifique o áudio selecionado e tente novamente.");
    } finally {
      setIsProcessingAudioFile(false);
    }
  }

  if (!shouldRender) return null;

  return (
    <View pointerEvents={isVisible ? "auto" : "box-none"} style={styles.host}>
      {isVisible && (
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeMeetingCreationSheet} />
      )}

      <Animated.View
        style={[
          styles.sheet,
          {
            paddingBottom: Math.max(insets.bottom, 18),
            transform: [{ translateY }],
          },
          Platform.OS === "ios" && styles.shadowIos,
          Platform.OS === "android" && styles.shadowAndroid,
          Platform.OS === "web" && styles.shadowWeb,
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>Subir arquivo</Text>
            <Text style={[styles.title, { color: colors.heading }]}>Importe o audio da reuniao</Text>
            <Text style={[styles.subtitle, { color: colors.bodyText }]}>
              Escolha um arquivo de audio do seu dispositivo para enviar ao Notura.
            </Text>
          </View>

          <TouchableOpacity
            onPress={closeMeetingCreationSheet}
            style={[styles.closeBtn, { backgroundColor: "rgba(175,82,222,0.10)" }]}
            activeOpacity={0.8}
          >
            <Feather name="x" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconWrap}>
            <Feather name="file" size={18} color="#5E4CEB" />
          </View>
          <View style={styles.infoCopy}>
            <Text style={styles.infoTitle}>{audioFile ? audioFile.name : "Audio externo"}</Text>
            <Text style={styles.infoText}>
              {audioFile
                ? "Arquivo pronto para ser processado pela IA."
                : "Ideal para reunioes do Zoom, Meet ou gravacoes exportadas do seu dispositivo."}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={audioFile ? handleProcessAudioFile : handlePickAudioFile}
          activeOpacity={0.9}
          disabled={isPickingAudioFile || isProcessingAudioFile}
        >
          {isPickingAudioFile || isProcessingAudioFile ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {audioFile ? "Processar reunião" : "Escolher áudio"}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 12, 22, 0.24)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  shadowIos: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  shadowAndroid: {
    elevation: 12,
  },
  shadowWeb: {
    boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
  } as any,
  handle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(28,28,30,0.14)",
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    marginTop: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(94,76,235,0.12)",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  infoIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(94,76,235,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCopy: {
    flex: 1,
    gap: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    letterSpacing: -0.2,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B6B7A",
  },
  primaryButton: {
    marginTop: 18,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
