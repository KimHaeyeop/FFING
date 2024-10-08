import axios from "./AxiosConfig";

interface UserIdInterface {
  userId: string;
}

// 목표 자산,소비액 확인
export async function getTargetPropertySpending(userId: string) {
  try {
    const response = await axios.get<UserIdInterface>(`/goal/check?userId=${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching get goal:', error);
    throw error;
  }
}

export default {
  getTargetPropertySpending,
};