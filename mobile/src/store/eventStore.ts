import { create } from "zustand";

type Event = {
  id: string;
  name: string;
  code: string;
  profilePic?: string | null;
  venue: string;
  startDate: string;
  endDate: string;
};

type EventStore = {
  event: Event | null;
  setEvent: (event: Event) => void;
  clearEvent: () => void;
};

export const useEventStore = create<EventStore>((set) => ({
  event: null,

  setEvent: (event) => set({ event }),

  clearEvent: () => set({ event: null }),
}));