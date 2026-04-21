import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FilterTabs } from "@/components/FilterTabs";
import { MeetingCard } from "@/components/MeetingCard";
import { SearchBar } from "@/components/SearchBar";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { MeetingStatus } from "@/lib/mockData";

const TABS = ["All", "Completed", "Processing", "Failed"];

function tabToStatus(tab: string): MeetingStatus | null {
  switch (tab) {
    case "Completed":
      return "completed";
    case "Processing":
      return "processing";
    case "Failed":
      return "failed";
    default:
      return null;
  }
}

export default function MeetingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { meetings, setCreateMeetingVisible } = useApp();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filtered = useMemo(() => {
    const statusFilter = tabToStatus(activeTab);
    return meetings.filter((m) => {
      const matchesStatus = !statusFilter || m.status === statusFilter;
      const matchesSearch =
        !search ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [meetings, search, activeTab]);

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Meetings
          </Text>
          <TouchableOpacity
            style={[
              styles.addBtn,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => setCreateMeetingVisible(true)}
            activeOpacity={0.8}
          >
            <Feather name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search meetings..."
        />
        <FilterTabs
          tabs={TABS}
          active={activeTab}
          onSelect={setActiveTab}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MeetingCard meeting={item} />}
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
            <Feather name="calendar" size={36} color={colors.gray300} />
            <Text style={[styles.emptyTitle, { color: colors.gray500 }]}>
              No meetings found
            </Text>
            <Text style={[styles.emptySub, { color: colors.gray400 }]}>
              {search ? "Try a different search" : "Create your first meeting"}
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
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
