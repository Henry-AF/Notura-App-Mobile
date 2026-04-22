import { create } from "zustand";

export type RecordingStatus = "idle" | "recording" | "paused";
export type RecordingSheetState = "hidden" | "partial" | "expanded";

type RecordingSnapshot = {
  elapsedSeconds: number;
};

interface RecordingStoreState {
  sheetState: RecordingSheetState;
  status: RecordingStatus;
  elapsedSeconds: number;
  openRecordingSheet: () => void;
  closeRecordingSheet: () => void;
  expandRecordingSheet: () => void;
  startRecordingSession: () => void;
  pauseRecordingSession: () => void;
  resumeRecordingSession: () => void;
  stopRecordingSession: () => RecordingSnapshot;
}

let elapsedTimer: ReturnType<typeof setInterval> | null = null;

function clearRecordingTimers() {
  if (elapsedTimer) {
    clearInterval(elapsedTimer);
    elapsedTimer = null;
  }
}

function startRecordingTimers() {
  clearRecordingTimers();

  elapsedTimer = setInterval(() => {
    const currentStatus = useRecordingStore.getState().status;
    if (currentStatus !== "recording") return;

    useRecordingStore.setState((state) => ({
      elapsedSeconds: state.elapsedSeconds + 1,
    }));
  }, 1000);
}

export function formatRecordingTimer(elapsedSeconds: number) {
  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export const useRecordingStore = create<RecordingStoreState>((set, get) => ({
  sheetState: "hidden",
  status: "idle",
  elapsedSeconds: 0,
  openRecordingSheet: () => set({ sheetState: "partial" }),
  closeRecordingSheet: () => set({ sheetState: "hidden" }),
  expandRecordingSheet: () => set({ sheetState: "expanded" }),
  startRecordingSession: () => {
    set({
      sheetState: "partial",
      status: "recording",
      elapsedSeconds: 0,
    });
    startRecordingTimers();
  },
  pauseRecordingSession: () => {
    set({ status: "paused" });
    clearRecordingTimers();
  },
  resumeRecordingSession: () => {
    set({ status: "recording" });
    startRecordingTimers();
  },
  stopRecordingSession: () => {
    const { elapsedSeconds } = get();
    clearRecordingTimers();
    set({
      sheetState: "hidden",
      status: "idle",
      elapsedSeconds: 0,
    });

    return { elapsedSeconds };
  },
}));
