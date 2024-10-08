import { useQuery } from "@tanstack/react-query";
import { getPets } from "../api/PetPediaApi";

export const usePetStats = (userId: string) => {
  return useQuery({
    queryKey: ['petStats', userId],  // 고유한 쿼리 키
    queryFn: async () => {
      const responsePetStats = await getPets(userId);
      return {
        currentWeek: responsePetStats.data.result.beforePetInfo,
        previousWeek: responsePetStats.data.result.currentPetInfo
      }
    },
    initialData: {
      currentWeek: { 식비: 0, 쇼핑: 0, 교통: 0, 생활: 0, 문화: 0 },
      previousWeek: { 식비: 0, 쇼핑: 0, 교통: 0, 생활: 0, 문화: 0 },
    }
  });
};
