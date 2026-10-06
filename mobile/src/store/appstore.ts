import { create } from "zustand";

type AppState = {
  userId: string | null;
  eventId: string | null;

  setUserId: (userId: string) => void;
  setEventId: (eventId: string) => void;
  clearSession: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  userId: null,
  eventId: null,

  setUserId: (userId) => set({ userId }),
  setEventId: (eventId) => set({ eventId }),

  clearSession: () =>
    set({
      userId: null,
      eventId: null,
    }),
}));