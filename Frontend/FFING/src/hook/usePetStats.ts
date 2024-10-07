import { useQuery } from "@tanstack/react-query";

export const usePetStats = () => {
  return useQuery({
    queryKey: ['petStats'],  // 고유한 쿼리 키
    queryFn: () => {
      // 실제 API 호출 대신 임시 데이터를 반환
      return {
        currentWeek: { 식비: 6, 쇼핑: 8, 교통: 7, 생활: 6, 문화: 6 },
        previousWeek: { 식비: 8, 쇼핑: 6, 교통: 6, 생활: 8, 문화: 8 },
      };
    },
    initialData: {
      currentWeek: { 식비: 5, 쇼핑: 7, 교통: 5, 생활: 7, 문화: 7 },
      previousWeek: { 식비: 6, 쇼핑: 5, 교통: 7, 생활: 6, 문화: 6 },
    }
  });
};