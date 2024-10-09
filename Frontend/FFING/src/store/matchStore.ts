import { create } from "zustand";

interface PetInfo {
  petInfoId: number;
  nickname: string;
  petCode: string;
  petType: string;
  winCount: number;
  loseCount: number;
  totalStat: number;
  stats: number[];
  recentScore: number[];
}

interface MatchStore {
  matchId: string | null;
  myInfo: PetInfo | null;
  opponentInfo: PetInfo | null;
  setMatchId: (id: string) => void;
  setMyInfo: (info: PetInfo) => void;
  setOpponentInfo: (info: PetInfo) => void;
  resetMatchInfo: () => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  matchId: null,
  myInfo: null,
  opponentInfo: null,
  setMatchId: (id) => set({ matchId: id }),
  setMyInfo: (info) => set({ myInfo: info }),
  setOpponentInfo: (info) => set({ opponentInfo: info }),
  resetMatchInfo: () => set({ matchId: null, myInfo: null, opponentInfo: null }),
}));