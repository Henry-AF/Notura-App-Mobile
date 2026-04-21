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

import { Avatar } from "@/components/Avatar";
import { SearchBar } from "@/components/SearchBar";
import { useColors } from "@/hooks/useColors";
import { mockContacts, type Contact } from "@/lib/mockData";

function ContactItem({ contact }: { contact: Contact }) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[
        styles.contactCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
    >
      <Avatar initials={contact.initials} color={contact.color} size={48} />
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.foreground }]}>
          {contact.name}
        </Text>
        <Text style={[styles.contactRole, { color: colors.gray500 }]}>
          {contact.role} · {contact.company}
        </Text>
        <View style={styles.contactMeta}>
          <Feather name="video" size={11} color={colors.gray400} />
          <Text style={[styles.contactMetaText, { color: colors.gray500 }]}>
            {contact.meetingsCount} meetings
          </Text>
          {contact.lastMeeting && (
            <>
              <Text style={[styles.dot, { color: colors.gray300 }]}>·</Text>
              <Text style={[styles.contactMetaText, { color: colors.gray500 }]}>
                Last {contact.lastMeeting}
              </Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={[
            styles.actionIcon,
            { backgroundColor: colors.brandSubtle },
          ]}
        >
          <Feather name="message-circle" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function ContactsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      mockContacts.filter(
        (c) =>
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.company.toLowerCase().includes(search.toLowerCase()) ||
          c.role.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Contacts
        </Text>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search contacts..."
        />

        <View
          style={[
            styles.integrationBanner,
            { backgroundColor: colors.brandSubtle, borderColor: colors.border },
          ]}
        >
          <Feather name="smartphone" size={16} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.intTitle, { color: colors.primary }]}>
              Connect WhatsApp
            </Text>
            <Text style={[styles.intSub, { color: colors.gray500 }]}>
              Share meeting summaries directly to contacts
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.connectBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.connectText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ContactItem contact={item} />}
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
            <Feather name="users" size={36} color={colors.gray300} />
            <Text style={[styles.emptyTitle, { color: colors.gray500 }]}>
              No contacts found
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
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  integrationBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  intTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  intSub: {
    fontSize: 11,
  },
  connectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  connectText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 8,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    borderWidth: 0.5,
    padding: 14,
    marginBottom: 8,
  },
  contactInfo: {
    flex: 1,
    gap: 3,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "600",
  },
  contactRole: {
    fontSize: 12,
  },
  contactMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  contactMetaText: {
    fontSize: 11,
  },
  dot: {
    fontSize: 11,
  },
  contactActions: {
    gap: 8,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
});
