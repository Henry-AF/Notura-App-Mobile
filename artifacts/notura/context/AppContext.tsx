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
  type Conversation,
  type Highlight,
  type Integration,
} from "@/lib/mockData";

interface AppContextType {
  conversations: Conversation[];
  highlights: Highlight[];
  integrations: Integration[];
  addConversation: (c: Conversation) => void;
  toggleActionItem: (conversationId: string, actionId: string) => void;
  addHighlight: (h: Highlight) => void;
  removeHighlight: (id: string) => void;
  toggleIntegration: (id: string) => void;
  isAuthenticated: boolean;
  currentUser: { name: string; email: string; initials: string; plan: "free" | "pro" };
  login: (email: string) => void;
  logout: () => void;
  pricingVisible: boolean;
  setPricingVisible: (v: boolean) => void;
  isRecording: boolean;
  setIsRecording: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [highlights, setHighlights] = useState<Highlight[]>(mockHighlights);
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pricingVisible, setPricingVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentUser] = useState({
    name: "Henry Costa",
    email: "henry@notura.ai",
    initials: "HC",
    plan: "free" as const,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const stored = await AsyncStorage.getItem("conversations_v2");
      if (stored) setConversations(JSON.parse(stored));
    } catch {}
  }

  async function addConversation(c: Conversation) {
    const updated = [c, ...conversations];
    setConversations(updated);
    try {
      await AsyncStorage.setItem("conversations_v2", JSON.stringify(updated));
    } catch {}
  }

  function toggleActionItem(conversationId: string, actionId: string) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              actionItems: (c.actionItems ?? []).map((a) =>
                a.id === actionId ? { ...a, completed: !a.completed } : a
              ),
            }
          : c
      )
    );
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
  }

  function logout() {
    setIsAuthenticated(false);
  }

  return (
    <AppContext.Provider
      value={{
        conversations,
        highlights,
        integrations,
        addConversation,
        toggleActionItem,
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
