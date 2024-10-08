import axios from "./AxiosConfig";

// 
// export interface getStocksInterface {
//   ssafyUserId: string;
// }

// 알림 리스트 조회
export async function get1() {
  try {
    const response = await axios.get(``);
    return response;
  } catch (error) {
    console.error('Error fetching getStocks:', error);
    throw error;
  }
}


export default {
  get1,
};