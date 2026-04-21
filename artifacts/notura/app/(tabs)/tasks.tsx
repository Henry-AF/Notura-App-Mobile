import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FilterTabs } from "@/components/FilterTabs";
import { TaskCard } from "@/components/TaskCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const TABS = ["All", "Open", "Done"];

export default function TasksScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tasks, toggleTask } = useApp();
  const [activeTab, setActiveTab] = useState("Open");

  const filtered = useMemo(() => {
    switch (activeTab) {
      case "Open":
        return tasks.filter((t) => !t.completed);
      case "Done":
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, activeTab]);

  const openCount = tasks.filter((t) => !t.completed).length;

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Tasks
          </Text>
          {openCount > 0 && (
            <View
              style={[
                styles.countBadge,
                { backgroundColor: colors.errorBg },
              ]}
            >
              <Text style={[styles.countText, { color: colors.error }]}>
                {openCount} open
              </Text>
            </View>
          )}
        </View>
        <FilterTabs tabs={TABS} active={activeTab} onSelect={setActiveTab} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={toggleTask} showMeta />
        )}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 + 84 : insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Feather
              name="check-circle"
              size={36}
              color={
                activeTab === "Done" ? colors.success : colors.gray300
              }
            />
            <Text style={[styles.emptyTitle, { color: colors.gray500 }]}>
              {activeTab === "Done"
                ? "No completed tasks yet"
                : "All clear!"}
            </Text>
            <Text style={[styles.emptySub, { color: colors.gray400 }]}>
              {activeTab === "Done"
                ? "Complete a task to see it here"
                : "No open tasks right now"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  countText: {
    fontSize: 12,
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptySub: {
    fontSize: 13,
  },
});
