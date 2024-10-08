import { create } from "zustand";

interface AuthState {
  userId: number | null;
  username: string | null;
  nickname: string | null;
  setAuth: (username: string, nickname: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: 1,
  username: null,
  nickname: null,
  setAuth: (username, nickname) => set({ username, nickname }),
  clearAuth: () => set({ username: null, nickname: null}),
}));