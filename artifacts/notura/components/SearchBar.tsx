import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
}: SearchBarProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Feather name="search" size={16} color={colors.gray400} />
      <TextInput
        style={[styles.input, { color: colors.foreground }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray300}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <Feather name="x" size={16} color={colors.gray400} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
