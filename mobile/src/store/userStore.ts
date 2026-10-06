import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  about?: string | null;
  interests: string[];
  profilePic?: string | null;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),
}));