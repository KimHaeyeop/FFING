import axios from "./AxiosConfig";

// 알림 리스트 조회
export async function getAlarms(userId: string) {
  try {
    const response = await axios.get(`/alarm?userId=${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching getStocks:', error);
    throw error;
  }
}


export default {
  getAlarms,
};