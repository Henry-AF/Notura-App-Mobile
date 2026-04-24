import { useRouter } from "expo-router";
import React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/components/Avatar";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type AppNavbarProps = {
  title: string;
  showBackButton?: boolean;
};

function formatPlanLabel(plan: "free" | "pro" | "team") {
  if (plan === "team") return "PLATINUM";
  return plan.toUpperCase();
}

export function AppNavbar({ title, showBackButton = false }: AppNavbarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser, setPricingVisible } = useApp();
  const topPad = Platform.OS === "web" ? 20 : insets.top + 8;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.row}>
        {showBackButton ? (
          <TouchableOpacity
            style={[styles.avatarTap, styles.backTap]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <View style={[styles.backIconWrap, { backgroundColor: "rgba(175,82,222,0.10)" }]}>
              <Text style={[styles.backChevron, { color: colors.primary }]}>‹</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.avatarTap}
            onPress={() => router.push("/(tabs)/profile")}
            activeOpacity={0.8}
          >
            {currentUser.avatarUrl ? (
              <Image
                source={{ uri: currentUser.avatarUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <Avatar
                initials={currentUser.initials}
                color={currentUser.avatarColor ?? colors.primary}
                size={40}
              />
            )}
          </TouchableOpacity>
        )}

        <Text style={[styles.title, { color: colors.heading }]} numberOfLines={1}>
          {title}
        </Text>

        <TouchableOpacity
          style={[styles.planBtn, { backgroundColor: "rgba(175,82,222,0.10)" }]}
          onPress={() => setPricingVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.planText, { color: colors.primary }]}>
            {formatPlanLabel(currentUser.plan)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 12 },
  row: { height: 40, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatarTap: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  backTap: { borderRadius: 20 },
  avatarImage: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.04)" },
  backIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  backChevron: { fontSize: 28, lineHeight: 28, fontWeight: "400", marginLeft: -2 },
  title: { position: "absolute", left: 66, right: 66, textAlign: "center", fontSize: 17, fontWeight: "600" },
  planBtn: { minWidth: 64, height: 32, borderRadius: 10, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" },
  planText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.3 },
});
