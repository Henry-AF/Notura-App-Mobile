import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(normalizeConversations(mockConversations));
  const [highlights, setHighlights] = useState<Highlight[]>(mockHighlights);
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pricingVisible, setPricingVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentUser] = useState({
    name: "Henry Costa",
    email: "henry@notura.ai",
    initials: "HC",
    avatarColor: "#5341CD",
    avatarUrl: undefined,
    plan: "free" as const,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const stored = await AsyncStorage.getItem("conversations_v2");
      if (stored) setConversations(normalizeConversations(JSON.parse(stored)));
      
      const auth = await AsyncStorage.getItem("isAuthenticated");
      if (auth === "true") setIsAuthenticated(true);
    } catch {}
  }

  async function persistConversations(nextConversations: Conversation[]) {
    try {
      await AsyncStorage.setItem("conversations_v2", JSON.stringify(nextConversations));
    } catch {}
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
                    : action
                ),
              }
            : conversation
        )
      );

      persistConversations(next);
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
            : conversation
        )
      );

      persistConversations(next);
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
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
  }

  function login(email: string) {
    setIsAuthenticated(true);
    AsyncStorage.setItem("isAuthenticated", "true").catch(() => {});
  }

  function logout() {
    setIsAuthenticated(false);
    AsyncStorage.setItem("isAuthenticated", "false").catch(() => {});
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
