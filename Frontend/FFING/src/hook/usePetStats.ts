import { useQuery } from "@tanstack/react-query";
import { getPets } from "../api/PetPediaApi";

export const usePetStats = (userId: string) => {
  return useQuery({
    queryKey: ['petStats', userId],  // 고유한 쿼리 키
    queryFn: async () => {
      const responsePetStats = await getPets(userId);
      return {
        currentWeek: {
          '식비': responsePetStats.data.result.currentPetInfo.foodBakeryStat,
          '쇼핑': responsePetStats.data.result.currentPetInfo.shoppingStat,
          '교통': responsePetStats.data.result.currentPetInfo.transportationStat,
          '생활/문화': responsePetStats.data.result.currentPetInfo.lifeCultureStat,
          '금융': responsePetStats.data.result.currentPetInfo.financeStat,
          'petCode': responsePetStats.data.result.currentPetInfo.petCode,
          'winCount': responsePetStats.data.result.currentPetInfo.winCount,
        },
        previousWeek: {
          '식비': responsePetStats.data.result.beforePetInfo.foodBakeryStat,
          '쇼핑': responsePetStats.data.result.beforePetInfo.shoppingStat,
          '교통': responsePetStats.data.result.beforePetInfo.transportationStat,
          '생활/문화': responsePetStats.data.result.beforePetInfo.lifeCultureStat,
          '금융': responsePetStats.data.result.beforePetInfo.financeStat,
        },
      }
    },
    initialData: {
      currentWeek: { '식비': 0, '쇼핑': 0, '교통': 0, '생활/문화': 0, '금융': 0, 'petCode': '000', 'winCount': 0},
      previousWeek: { '식비': 0, '쇼핑': 0, '교통': 0, '생활/문화': 0, '금융': 0, }, 
    }
  });
};
