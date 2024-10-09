import { useQuery } from "@tanstack/react-query";
import { getSixMonthExpense } from '../api/SpendingApi'

export const useSpendingAnalysis = (userId: string, ssafyUserId: string) => {
  return useQuery({
    queryKey: ['useSpendingAnalysis', userId, ssafyUserId],  // 고유한 쿼리 키
    queryFn: async () => {
      const response = await getSixMonthExpense(userId, ssafyUserId);
      return response.data.result
    },
    initialData: {
      totalTargetExpense: 0,
      monthAverageExpense: 0,
      monthlyTargetExpense: 0,
      sixMonthTotalExpense: 0,
      monthOverMonthChange: 0,
      yearlyTotalExpense: 0,
      futureMonthlyExpenses: [],
    }
  });
};