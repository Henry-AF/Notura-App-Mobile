import { create } from "zustand";

export type MeetingCreationSheet = "hidden" | "entry" | "upload";

interface MeetingCreationStoreState {
  activeSheet: MeetingCreationSheet;
  openMeetingEntrySheet: () => void;
  openUploadSheet: () => void;
  closeMeetingCreationSheet: () => void;
}

export const useMeetingCreationStore = create<MeetingCreationStoreState>((set) => ({
  activeSheet: "hidden",
  openMeetingEntrySheet: () => set({ activeSheet: "entry" }),
  openUploadSheet: () => set({ activeSheet: "upload" }),
  closeMeetingCreationSheet: () => set({ activeSheet: "hidden" }),
}));
