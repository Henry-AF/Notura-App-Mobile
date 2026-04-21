import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface FilterTabsProps {
  tabs: string[];
  active: string;
  onSelect: (tab: string) => void;
}

export function FilterTabs({ tabs, active, onSelect }: FilterTabsProps) {
  const colors = useColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              {
                backgroundColor: isActive ? colors.primary : colors.secondary,
              },
            ]}
            onPress={() => onSelect(tab)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? "#fff" : colors.gray600,
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 9999,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
  },
});
