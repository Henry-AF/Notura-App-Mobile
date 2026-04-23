import { QueryClient, focusManager } from "@tanstack/react-query";
import { AppState, type AppStateStatus, Platform } from "react-native";

const MOBILE_STALE_TIME_MS = 1000 * 60 * 2;
const MOBILE_GC_TIME_MS = 1000 * 60 * 30;

let cleanupFocusSubscription: (() => void) | null = null;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: MOBILE_STALE_TIME_MS,
      gcTime: MOBILE_GC_TIME_MS,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export function configureMobileQueryFocusSync() {
  if (Platform.OS === "web") return () => undefined;
  if (cleanupFocusSubscription) return cleanupFocusSubscription;

  const handleAppStateChange = (status: AppStateStatus) => {
    focusManager.setFocused(status === "active");
  };

  const subscription = AppState.addEventListener("change", handleAppStateChange);
  cleanupFocusSubscription = () => {
    subscription.remove();
    cleanupFocusSubscription = null;
  };

  return cleanupFocusSubscription;
}
