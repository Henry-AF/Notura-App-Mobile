import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { InsightCard } from "@/components/InsightCard";
import { MeetingCard } from "@/components/MeetingCard";
import { StatCard } from "@/components/StatCard";
import { TaskCard } from "@/components/TaskCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { mockInsight, mockStats } from "@/lib/mockData";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    meetings,
    tasks,
    toggleTask,
    currentUser,
    setPricingVisible,
    setCreateMeetingVisible,
  } = useApp();

  const recentMeetings = useMemo(
    () => meetings.filter((m) => m.status !== "failed").slice(0, 3),
    [meetings]
  );

  const todayTasks = useMemo(
    () => tasks.filter((t) => !t.completed).slice(0, 4),
    [tasks]
  );

  const topPaddingWeb = Platform.OS === "web" ? 67 : insets.top + 8;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topPaddingWeb,
            paddingBottom:
              Platform.OS === "web" ? 34 : insets.bottom + 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.greeting, { color: colors.gray500 }]}>
              {greeting()},
            </Text>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {currentUser.name.split(" ")[0]}
            </Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setPricingVisible(true)}
              activeOpacity={0.7}
            >
              <Feather name="zap" size={18} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              activeOpacity={0.8}
            >
              <Avatar
                initials={currentUser.initials}
                color={colors.primary}
                size={40}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Meetings this month"
            value={mockStats.meetingsThisMonth}
            sublabel="+4 vs last month"
          />
          <StatCard
            label="Open tasks"
            value={mockStats.openTasks}
            sublabel={`${mockStats.completionRate}% completion`}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            label="Time saved by AI"
            value={mockStats.timeSaved}
            sublabel="This month"
          />
        </View>

        <InsightCard
          title={mockInsight.title}
          text={mockInsight.text}
          badge={mockInsight.badge}
        />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Recent meetings
          </Text>
          <TouchableOpacity onPress={() => router.push("/meetings")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {recentMeetings.map((m) => (
          <MeetingCard key={m.id} meeting={m} compact />
        ))}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Today's tasks
          </Text>
          <TouchableOpacity onPress={() => router.push("/tasks")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {todayTasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onToggle={toggleTask}
            showMeta={false}
          />
        ))}

        {todayTasks.length === 0 && (
          <View
            style={[
              styles.emptyState,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name="check-circle" size={24} color={colors.success} />
            <Text style={[styles.emptyText, { color: colors.gray500 }]}>
              All tasks done for today!
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setCreateMeetingVisible(true)}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: 13,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statsRow: {
    flexDirection: "row",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "500",
  },
  emptyState: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 16,
  },
  emptyText: {
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: Platform.OS === "web" ? 34 + 84 + 16 : 100,
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5341CD",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
});
