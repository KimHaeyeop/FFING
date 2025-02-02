import axios from "./AxiosConfig";

// 지출 내역 인터페이스
export interface ExpenseDetail {
  category: string;
}

// 월간 지출 인터페이스
export interface MonthlyExpense {
  yyyyMm: string;
}

// 주간 카테고리 및 전체 지출액 확인 인터페이스
export interface WeeklyExpense {
  when: string;
}

// 지출 분석 정보를 불러오기 위한 API
export interface SixMonthExpense {
  userId: string;
  ssafyUserId: string;
}

// 당월 지출 상세 내역 조회
export async function getExpenseDetail(category: string) {
  try {
    const response = await axios.get<ExpenseDetail>(`/expense/monthly?category=${category}`);
    return response;
  } catch (error) {
    console.error('Error fetching expense detail:', error);
    throw error;
  }
}

// 주간 카테고리 및 전체 지출액 확인
export async function getWeeklyCategorySpending(when: string) {
  try {
    const response = await axios.get<WeeklyExpense>(`/expense/weekly/category/${when}`); // this(이번주) or last(저번주)
    return response;
  } catch (error) {
    console.error('Error fetching weekly category spending:', error);
    throw error;
  }
}

// 당월 지출 상세 내역 조회
export async function getThisMonthCategorySpending() {
  try {
    const response = await axios.get('/expense/monthly/category');
    return response;
  } catch (error) {
    console.error('Error fetching this month category spending:', error);
    throw error;
  }
}

// 월간 지출액 및 일간 수입/지출액 조회
export async function getMonthlyExpense(yyyyMm: string) {
  try {
    const response = await axios.get<MonthlyExpense>(`/expense/monthly/${yyyyMm}`);
    return response
  } catch (error) {
    console.error('Error fetching monthly expense:', error);
    throw error;
  }
}

// 특정 날짜 지출내역, 지출액 및 해당 주 지출액 조회
export async function getCertainDateExpense(yyyyMmDd: string) {
  try {
    const response = await axios.get(`/expense?date=${yyyyMmDd}`);
    return response;
  } catch (error) {
    console.log('Error fetching certain expense:', error)
    throw error
  }
}

// 월별(6개월 간) 지출액 확인 및 월간 지출 분석 API
export async function getSixMonthExpense(userId: string, ssafyUserId: string) {
  try {
    // 쿼리 스트링을 연결하기 위해서는 &를 붙인다.
    const response = await axios.get<SixMonthExpense>(`/expense/monthly-summary?userId=${userId}&ssafyUserId=${ssafyUserId}`);
    return response;
  } catch (error) {
    console.error('Error fetching six month expense:', error);
    throw error;
  }
}

export default {
  getExpenseDetail,
  getWeeklyCategorySpending,
  getThisMonthCategorySpending,
  getMonthlyExpense,
  getCertainDateExpense,
  getSixMonthExpense,
};