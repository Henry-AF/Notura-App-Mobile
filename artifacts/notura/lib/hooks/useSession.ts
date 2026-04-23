import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { AppState, Platform, type AppStateStatus } from "react-native";

import { getSupabaseClient } from "../supabase.ts";

export interface SessionState {
  isReady: boolean;
  isAuthenticated: boolean;
  session: Session | null;
}

function onAppStateChange(nextState: AppStateStatus) {
  const auth = getSupabaseClient().auth;

  if (nextState === "active") {
    auth.startAutoRefresh();
    return;
  }

  auth.stopAutoRefresh();
}

export function useSession(): SessionState {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = getSupabaseClient();
    const auth = supabase.auth;

    if (Platform.OS !== "web") {
      auth.startAutoRefresh();
    }

    auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSession(data.session);
        setIsReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        setSession(null);
        setIsReady(true);
      });

    const { data: authListener } = auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setIsReady(true);
    });

    const appStateSubscription =
      Platform.OS === "web"
        ? null
        : AppState.addEventListener("change", onAppStateChange);

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
      if (appStateSubscription !== null) {
        appStateSubscription.remove();
      }
      if (Platform.OS !== "web") {
        auth.stopAutoRefresh();
      }
    };
  }, []);

  return {
    isReady,
    isAuthenticated: session !== null,
    session,
  };
}
