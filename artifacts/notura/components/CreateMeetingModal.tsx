import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import type { Meeting } from "@/lib/mockData";

interface CreateMeetingModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateMeetingModal({
  visible,
  onClose,
}: CreateMeetingModalProps) {
  const colors = useColors();
  const { addMeeting } = useApp();
  const [title, setTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasFile, setHasFile] = useState(false);

  function handleCreate() {
    if (!title.trim()) return;
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: title.trim(),
      subtitle: "New meeting",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      duration: "—",
      status: "processing",
      participants: 1,
      tasks: [],
      transcript: [],
    };
    addMeeting(meeting);
    setTitle("");
    setHasFile(false);
    setIsRecording(false);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.root, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            New Meeting
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.gray500} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.gray600 }]}>
              Meeting title *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Q2 Strategy Review"
              placeholderTextColor={colors.gray300}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.gray600 }]}>
              Audio source
            </Text>

            <TouchableOpacity
              style={[
                styles.uploadBox,
                {
                  backgroundColor: hasFile
                    ? colors.brandSubtle
                    : colors.secondary,
                  borderColor: hasFile ? colors.primary : colors.border,
                  borderStyle: hasFile ? "solid" : "dashed",
                },
              ]}
              onPress={() => setHasFile(!hasFile)}
              activeOpacity={0.7}
            >
              <Feather
                name={hasFile ? "file-text" : "upload-cloud"}
                size={28}
                color={hasFile ? colors.primary : colors.gray400}
              />
              <Text
                style={[
                  styles.uploadText,
                  { color: hasFile ? colors.primary : colors.gray500 },
                ]}
              >
                {hasFile
                  ? "meeting-audio.m4a selected"
                  : "Tap to upload audio file"}
              </Text>
              <Text style={[styles.uploadSub, { color: colors.gray400 }]}>
                MP3, M4A, WAV, MP4 — up to 500MB
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <Text style={[styles.dividerText, { color: colors.gray400 }]}>
              or
            </Text>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.recordBtn,
              {
                backgroundColor: isRecording
                  ? colors.errorBg
                  : colors.brandSubtle,
                borderColor: isRecording ? colors.error : colors.primary,
              },
            ]}
            onPress={() => setIsRecording(!isRecording)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.recordDot,
                {
                  backgroundColor: isRecording ? colors.error : colors.primary,
                },
              ]}
            />
            <Text
              style={[
                styles.recordText,
                {
                  color: isRecording ? colors.error : colors.primary,
                },
              ]}
            >
              {isRecording ? "Recording... Tap to stop" : "Record audio"}
            </Text>
            {isRecording && (
              <Text style={[styles.recordTime, { color: colors.error }]}>
                0:23
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.createBtn,
              {
                backgroundColor: title.trim()
                  ? colors.primary
                  : colors.secondary,
              },
            ]}
            onPress={handleCreate}
            activeOpacity={0.8}
          >
            <Feather
              name="plus"
              size={18}
              color={title.trim() ? "#fff" : colors.gray400}
            />
            <Text
              style={[
                styles.createText,
                { color: title.trim() ? "#fff" : colors.gray400 },
              ]}
            >
              Create Meeting
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "web" ? 67 : 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 20,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  uploadBox: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "500",
  },
  uploadSub: {
    fontSize: 12,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
  },
  recordBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    height: 52,
    gap: 10,
  },
  recordDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  recordText: {
    fontSize: 15,
    fontWeight: "500",
  },
  recordTime: {
    fontSize: 13,
    fontFamily: "monospace",
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 9999,
    marginTop: 8,
  },
  createText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
