import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userId: number | null;
  username: string | null;
  nickname: string | null;
  setAuth: (nickname: string, userId: number, username: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      username: null,
      nickname: null,
      setAuth: (nickname, userId, username) => set({ nickname, userId, username }),
      clearAuth: () => set({ nickname: null, userId: null, username: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);