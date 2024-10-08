import axios from "./AxiosConfig";

interface petInterface {
  userId: string;
  yearMonth: string | null;
}

// 펫 조회
export async function getPets(userId: string) {
  try {
    const response = await axios.get<petInterface>(`/pet?userId=${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching get goal:', error);
    throw error;
  }
}

// 도감 조회
export async function getPetPedia(userId: string) {
  try {
    const response = await axios.get<petInterface>(`/pet/collection?userId=${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching get goal:', error);
    throw error;
  }
}

// 히스토리 조회
export async function getPetHistroy(userId: string, yearMonth: string) {
  try {
    const response = await axios.get<petInterface>(`/goal/history/${yearMonth}?userId=${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching get goal:', error);
    throw error;
  }
}

export default {
  getPets,
  getPetPedia,
  getPetHistroy
};