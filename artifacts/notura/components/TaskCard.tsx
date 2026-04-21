import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { useColors } from "@/hooks/useColors";
import type { Task, TaskPriority } from "@/lib/mockData";

interface TaskCardProps {
  task: Task;
  onToggle?: (id: string) => void;
  showMeta?: boolean;
}

function priorityVariant(p: TaskPriority) {
  switch (p) {
    case "high":
      return "error";
    case "medium":
      return "warning";
    default:
      return "neutral";
  }
}

export function TaskCard({ task, onToggle, showMeta = true }: TaskCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: task.completed ? 0.65 : 1,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle?.(task.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkboxInner,
            {
              borderColor: task.completed ? colors.primary : colors.border,
              backgroundColor: task.completed
                ? colors.primary
                : "transparent",
            },
          ]}
        >
          {task.completed && (
            <Feather name="check" size={12} color="#fff" />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: colors.foreground,
              textDecorationLine: task.completed ? "line-through" : "none",
            },
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {showMeta && (
          <View style={styles.meta}>
            <Badge
              label={
                task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
              }
              variant={priorityVariant(task.priority)}
            />
            {task.tags.map((tag) => (
              <Badge key={tag} label={tag} variant="neutral" />
            ))}
          </View>
        )}

        {task.dueDate && (
          <View style={styles.dueRow}>
            <Feather name="calendar" size={11} color={colors.gray400} />
            <Text style={[styles.due, { color: colors.gray500 }]}>
              Due {task.dueDate}
            </Text>
          </View>
        )}
      </View>

      <Avatar
        initials={task.assigneeInitials}
        color={task.assigneeColor}
        size={32}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    paddingTop: 2,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  dueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  due: {
    fontSize: 11,
  },
});
