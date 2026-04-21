import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  mockMeetings,
  mockTasks,
  type Meeting,
  type Task,
} from "@/lib/mockData";

interface AppContextType {
  meetings: Meeting[];
  tasks: Task[];
  toggleTask: (id: string) => void;
  addMeeting: (m: Meeting) => void;
  isAuthenticated: boolean;
  currentUser: { name: string; email: string; initials: string };
  login: (email: string) => void;
  logout: () => void;
  pricingVisible: boolean;
  setPricingVisible: (v: boolean) => void;
  createMeetingVisible: boolean;
  setCreateMeetingVisible: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pricingVisible, setPricingVisible] = useState(false);
  const [createMeetingVisible, setCreateMeetingVisible] = useState(false);
  const [currentUser] = useState({
    name: "Henry Costa",
    email: "henry@notura.ai",
    initials: "HC",
  });

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const stored = await AsyncStorage.getItem("tasks");
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch {}
  }

  async function toggleTask(id: string) {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(updated));
    } catch {}
  }

  function addMeeting(m: Meeting) {
    setMeetings((prev) => [m, ...prev]);
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
        meetings,
        tasks,
        toggleTask,
        addMeeting,
        isAuthenticated,
        currentUser,
        login,
        logout,
        pricingVisible,
        setPricingVisible,
        createMeetingVisible,
        setCreateMeetingVisible,
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
