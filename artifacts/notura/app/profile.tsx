import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
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
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface MenuRowProps {
  icon: string;
  label: string;
  sublabel?: string;
  color?: string;
  onPress?: () => void;
  rightContent?: React.ReactNode;
}

function MenuRow({ icon, label, sublabel, color, onPress, rightContent }: MenuRowProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[
        styles.menuRow,
        { borderBottomColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View
        style={[
          styles.menuIcon,
          { backgroundColor: (color ?? colors.primary) + "18" },
        ]}
      >
        <Feather
          name={icon as any}
          size={17}
          color={color ?? colors.primary}
        />
      </View>
      <View style={styles.menuLabel}>
        <Text style={[styles.menuLabelText, { color: colors.foreground }]}>
          {label}
        </Text>
        {sublabel && (
          <Text style={[styles.menuSublabel, { color: colors.gray500 }]}>
            {sublabel}
          </Text>
        )}
      </View>
      {rightContent ?? (
        <Feather name="chevron-right" size={16} color={colors.gray300} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser, setPricingVisible, logout } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Profile
        </Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 : insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Avatar
            initials={currentUser.initials}
            color={colors.primary}
            size={72}
          />
          <Text style={[styles.profileName, { color: colors.foreground }]}>
            {currentUser.name}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.gray500 }]}>
            {currentUser.email}
          </Text>
          <View
            style={[
              styles.planBadge,
              { backgroundColor: colors.brandSubtle },
            ]}
          >
            <Feather name="star" size={12} color={colors.primary} />
            <Text style={[styles.planText, { color: colors.primary }]}>
              Free plan
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.menuSection,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <MenuRow
            icon="zap"
            label="Upgrade to Pro"
            sublabel="Unlimited meetings & AI insights"
            onPress={() => setPricingVisible(true)}
          />
          <MenuRow icon="bell" label="Notifications" />
          <MenuRow icon="moon" label="Dark mode" />
          <MenuRow icon="globe" label="Language" sublabel="English" />
        </View>

        <View
          style={[
            styles.menuSection,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <MenuRow icon="shield" label="Privacy & Security" />
          <MenuRow icon="help-circle" label="Help & Support" />
          <MenuRow icon="file-text" label="Terms of Service" />
        </View>

        <View
          style={[
            styles.menuSection,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <MenuRow
            icon="log-out"
            label="Sign out"
            color={colors.error}
            onPress={logout}
          />
        </View>

        <Text style={[styles.version, { color: colors.gray400 }]}>
          Notura v1.0.0
        </Text>
      </ScrollView>
    </View>
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
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
    paddingTop: 8,
  },
  profileCard: {
    borderRadius: 20,
    borderWidth: 0.5,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
  },
  profileEmail: {
    fontSize: 14,
  },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    marginTop: 4,
  },
  planText: {
    fontSize: 12,
    fontWeight: "600",
  },
  menuSection: {
    borderRadius: 16,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
    borderBottomWidth: 0.5,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    gap: 2,
  },
  menuLabelText: {
    fontSize: 15,
    fontWeight: "500",
  },
  menuSublabel: {
    fontSize: 12,
  },
  version: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
});
