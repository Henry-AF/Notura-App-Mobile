import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider, useApp } from "@/context/AppContext";
import {
  configureMobileQueryFocusSync,
  queryClient,
} from "@/lib/query-client";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isSessionReady } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isSessionReady) return;
    const firstSegment = segments[0] as string | undefined;
    const inAuthGroup = firstSegment === "auth";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/auth");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isSessionReady, segments, router]);

  if (!isSessionReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="conversation/[id]"
        options={{
          headerShown: false,
          presentation: "card",
          animation: "slide_from_right",
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="record"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="highlights"
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    return configureMobileQueryFocusSync();
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AppProvider>
                <RootLayoutNav />
              </AppProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
