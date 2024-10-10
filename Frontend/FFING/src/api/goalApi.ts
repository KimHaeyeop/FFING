import axios from "./AxiosConfig";

interface UserIdInterface {
  userId: string;
}

interface GoalData {
  totalAsset: string;
  leftMonths: number;
  fixedIncome: string;
  recommendedGoalBalance: string;
  upperLimitBalance: string;
  lowerLimitBalance: string;
}

interface GoalSetData {
  userId: number;
  goalBalance: string;
  spendingBalance: string;
}

// 목표 자산,소비액 확인
export async function getTargetPropertySpending(userId: string) {
  try {
    const response = await axios.get<UserIdInterface>(
      `/goal/check?userId=${userId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching get goal:", error);
    throw error;
  }
}

export async function getGoalData() {
  try {
    const response = await axios.get<{ result: GoalData }>("/goal");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching goal data:", error);
    throw error;
  }
}

export async function setGoal(data: GoalSetData) {
  try {
    const response = await axios.post<{ message: string }>(
      "/goal/set-goal",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error setting goal:", error);
    throw error;
  }
}

export default {
  getTargetPropertySpending,
};
