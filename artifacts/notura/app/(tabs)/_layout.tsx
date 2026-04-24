import { Slot } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { GlassBackground } from "@/components/GlassBackground";
import { GlassTabBar } from "@/components/GlassTabBar";
import { NewMeetingBottomSheet } from "@/components/NewMeetingBottomSheet";
import { PricingModal } from "@/components/PricingModal";
import { RecordingBottomSheet } from "@/components/RecordingBottomSheet";
import { RecordingFloatingIndicator } from "@/components/RecordingFloatingIndicator";
import { UploadMeetingBottomSheet } from "@/components/UploadMeetingBottomSheet";
import { useApp } from "@/context/AppContext";

export default function TabLayout() {
  const { pricingVisible, setPricingVisible } = useApp();

  return (
    <GlassBackground>
      <View style={styles.root}>
        <Slot />
        <GlassTabBar />
        <RecordingFloatingIndicator />
        <NewMeetingBottomSheet />
        <UploadMeetingBottomSheet />
        <RecordingBottomSheet />
        <PricingModal visible={pricingVisible} onClose={() => setPricingVisible(false)} />
      </View>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
