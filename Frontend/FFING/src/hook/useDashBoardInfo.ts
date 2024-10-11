import { useQuery } from "@tanstack/react-query";
import { getDashBoardMain } from "../api/AssetApi";

// responsePetStats.data.result 형태 기반으로 완성된 useQuery
export const useDashBoardInfo = (userId: string) => {
  return useQuery({
    queryKey: ['dashBoardInfo', userId], // 고유한 쿼리 키
    queryFn: async () => {
      const response = await getDashBoardMain(userId);
      return response.data.result;  // API 응답 데이터 반환
    },
    initialData: {
      goalBalance: 0,
      totalAsset: 0,
      petCode: '000',
      monthGoalSpending: 0,
      monthTotalSpending: 0,
      monthCategoryExpenses: [
        {
          category: "FINANCE",
          totalAmount: 0,
          startDate: "",
          endDate: ""
        },
        {
          category: "FOOD_BAKERY",
          totalAmount: 0,
          startDate: "",
          endDate: ""
        },
        {
          category: "LIFE_CULTURE",
          totalAmount: 0,
          startDate: "",
          endDate: ""
        },
        {
          category: "SHOPPING",
          totalAmount: 0,
          startDate: "",
          endDate: ""
        },
        {
          category: "TRANSPORTATION",
          totalAmount: 0,
          startDate: "",
          endDate: ""
        },
        {
          category: "OVERSEAS",
          totalAmount: 0,
          startDate: "",
          endDate: ""
        }
      ]
    }
  });
};

// petCode만 따로 사용할 수 있게 정리
export const usePetCode = (userId: string) => {
  const { data } = useDashBoardInfo(userId);
  return data?.petCode;
};
