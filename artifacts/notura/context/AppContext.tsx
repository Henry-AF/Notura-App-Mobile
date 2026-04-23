import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api-client";
import { useSession } from "@/lib/hooks/useSession";
import { getSupabaseAuth } from "@/lib/supabase";
import {
  mockConversations,
  mockHighlights,
  mockIntegrations,
  type ActionItem,
  type ActionItemStatus,
  type Conversation,
  type Highlight,
  type Integration,
} from "@/lib/mockData";

interface AppContextType {
  conversations: Conversation[];
  highlights: Highlight[];
  integrations: Integration[];
  addConversation: (c: Conversation) => void;
  updateActionItem: (conversationId: string, actionId: string, updates: Partial<ActionItem>) => void;
  removeActionItem: (conversationId: string, actionId: string) => void;
  addHighlight: (h: Highlight) => void;
  removeHighlight: (id: string) => void;
  toggleIntegration: (id: string) => void;
  isAuthenticated: boolean;
  isSessionReady: boolean;
  currentUser: {
    name: string;
    email: string;
    initials: string;
    avatarColor?: string;
    avatarUrl?: string;
    plan: "free" | "pro" | "platinum";
  };
  login: (email: string) => void;
  logout: () => void;
  pricingVisible: boolean;
  setPricingVisible: (v: boolean) => void;
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function normalizeActionStatus(action: ActionItem): ActionItemStatus {
  if (action.status) return action.status;
  return action.completed ? "done" : "todo";
}

function normalizeConversations(conversations: Conversation[]) {
  return conversations.map((conversation) => ({
    ...conversation,
    actionItems: (conversation.actionItems ?? []).map((action) => {
      const status = normalizeActionStatus(action);
      return {
        ...action,
        status,
        completed: status === "done",
      };
    }),
  }));
}

function normalizePlan(plan: string | undefined): "free" | "pro" | "platinum" {
  if (plan === "pro" || plan === "platinum") {
    return plan;
  }
  return "free";
}

function deriveName(profileName: string | null | undefined, email: string) {
  if (typeof profileName === "string" && profileName.trim().length > 0) {
    return profileName.trim();
  }

  const localPart = email.split("@")[0];
  if (localPart.length > 0) {
    return localPart;
  }

  return "Notura User";
}

function buildInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0);

  if (parts.length === 0) {
    return "NU";
  }

  const firstLetter = parts[0].slice(0, 1).toUpperCase();
  const secondSource = parts.length > 1 ? parts[1] : parts[0];
  const secondLetter = secondSource.slice(0, 1).toUpperCase();
  return `${firstLetter}${secondLetter}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { session, isAuthenticated, isReady: isSessionReady } = useSession();

  const [conversations, setConversations] = useState<Conversation[]>(
    normalizeConversations(mockConversations),
  );
  const [highlights, setHighlights] = useState<Highlight[]>(mockHighlights);
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [pricingVisible, setPricingVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const { data: meResponse } = useQuery({
    queryKey: ["user-me", session ? session.user.id : "anonymous"],
    queryFn: () => api.user.me(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const currentUser = useMemo(() => {
    const profile = meResponse ? meResponse.user : null;
    const email =
      profile && profile.email.length > 0
        ? profile.email
        : typeof session?.user.email === "string"
          ? session.user.email
          : "";
    const name = deriveName(profile?.name, email);

    return {
      name,
      email,
      initials: buildInitials(name),
      avatarColor: "#5341CD",
      avatarUrl: undefined,
      plan: normalizePlan(profile?.plan),
    };
  }, [meResponse, session]);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    try {
      const stored = await AsyncStorage.getItem("conversations_v2");
      if (stored) {
        const parsed = JSON.parse(stored) as Conversation[];
        setConversations(normalizeConversations(parsed));
      }
    } catch (error) {
      console.warn("Falha ao carregar conversas persistidas.", error);
    }
  }

  async function persistConversations(nextConversations: Conversation[]) {
    try {
      await AsyncStorage.setItem("conversations_v2", JSON.stringify(nextConversations));
    } catch (error) {
      console.warn("Falha ao persistir conversas.", error);
    }
  }

  async function addConversation(c: Conversation) {
    const updated = normalizeConversations([c, ...conversations]);
    setConversations(updated);
    await persistConversations(updated);
  }

  function updateActionItem(conversationId: string, actionId: string, updates: Partial<ActionItem>) {
    setConversations((prev) => {
      const next = normalizeConversations(
        prev.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                actionItems: (conversation.actionItems ?? []).map((action) =>
                  action.id === actionId
                    ? {
                        ...action,
                        ...updates,
                        completed:
                          updates.status !== undefined
                            ? updates.status === "done"
                            : updates.completed ?? action.completed,
                      }
                    : action,
                ),
              }
            : conversation,
        ),
      );

      void persistConversations(next);
      return next;
    });
  }

  function removeActionItem(conversationId: string, actionId: string) {
    setConversations((prev) => {
      const next = normalizeConversations(
        prev.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                actionItems: (conversation.actionItems ?? []).filter((action) => action.id !== actionId),
              }
            : conversation,
        ),
      );

      void persistConversations(next);
      return next;
    });
  }

  function addHighlight(h: Highlight) {
    setHighlights((prev) => [h, ...prev]);
  }

  function removeHighlight(id: string) {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }

  function toggleIntegration(id: string) {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration,
      ),
    );
  }

  function login(_email: string) {
    console.warn("login(email) legado acionado. Use o fluxo real na tela /auth.");
  }

  function logout() {
    void getSupabaseAuth().signOut();
  }

  return (
    <AppContext.Provider
      value={{
        conversations,
        highlights,
        integrations,
        addConversation,
        updateActionItem,
        removeActionItem,
        addHighlight,
        removeHighlight,
        toggleIntegration,
        isAuthenticated,
        isSessionReady,
        currentUser,
        login,
        logout,
        pricingVisible,
        setPricingVisible,
        isRecording,
        setIsRecording,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
