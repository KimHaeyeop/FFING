import { create } from "zustand";

interface AuthState {
  username: string | null;
  nickname: string | null;
  setAuth: (username: string, nickname: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  username: null,
  nickname: null,
  setAuth: (username, nickname) => set({ username, nickname }),
  clearAuth: () => set({ username: null, nickname: null}),
}));