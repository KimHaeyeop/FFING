import { useQuery } from "@tanstack/react-query";
import { getPetHistroy } from "../api/PetPediaApi";

// responsePetStats.data.result 형태 기반으로 완성된 useQuery
export const usePetHistoy = (userId: string, yearMonth: string) => {
  return useQuery({
    queryKey: ['petHistory', userId, yearMonth], // 고유한 쿼리 키, yearMonth 추가
    queryFn: async () => {
      const responsePetStats = await getPetHistroy(userId, yearMonth);
      return responsePetStats.data.result;  // API 응답 데이터 반환
    },
    initialData: [
      {
        petInfoId: 0,
        totalStat: 0,
        financeStat: 0,
        foodBakeryStat: 0,
        lifeCultureStat: 0,
        shoppingStat: 0,
        transportationStat: 0,
        winCount: 0,
        loseCount: 0,
        petCode: "",
        petName: "",
        typeCode: "",
        typeName: "",
        yearMonth: yearMonth,
        week: 0
      }
    ]
  });
};