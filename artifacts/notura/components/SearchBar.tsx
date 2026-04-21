import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Buscar..." }: SearchBarProps) {
  const colors = useColors();

  const inner = (
    <>
      <Feather name="search" size={16} color="#AF52DE" />
      <TextInput
        style={[styles.input, { color: colors.heading }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B0A0C8"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Feather name="x" size={16} color={colors.gray400} />
        </TouchableOpacity>
      )}
    </>
  );

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={50}
        tint="systemUltraThinMaterialLight"
        style={[styles.container, { borderColor: colors.glassBorder }]}
      >
        {inner}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: "rgba(175,82,222,0.06)",
          borderColor: colors.glassBorder,
        },
      ]}
    >
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 10,
    overflow: "hidden",
  },
  input: { flex: 1, fontSize: 14 },
});
