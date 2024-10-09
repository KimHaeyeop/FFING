import axios from "./AxiosConfig";

// 
// export interface getStocksInterface {
//   ssafyUserId: string;
// }

// 알림 리스트 조회
export async function getAlarms() {
  try {
    const response = await axios.get(`/alarm`);
    console.log('api 요청 완료')
    return response;
  } catch (error) {
    console.error('Error fetching getStocks:', error);
    throw error;
  }
}


export default {
  getAlarms,
};