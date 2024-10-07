import axios from "./AxiosConfig";

// // 현재 보유 중인 증권사별 자산 개요 인터페이스
export interface get1Interface {
  ssafyUserId: string;
}

// 증권사의 각 주식 종목 자산 개요 인터페이스
export interface get2Interface {
  ssafyUserId: string;
  stockAccountId: string
}

// 현재 전체 자산 조회 인터페이스
export interface getTotalAssetInterface {
  userId: string;
}

// 예적금 계좌별 입출금 조회 인터페이스
export interface getTransactionInterface {
  accountId: string;
  type: string;
}

// 예적금 계좌별 입출금 조회 인터페이스
export interface get7Interface {
  accountId: string;
}

// 현재 보유 중인 증권사별 자산 개요 불러오기
export async function get1(ssafyUserId: string) {
  try {
    const response = await axios.get<get1Interface>(`/stock/${ssafyUserId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error fetching get1:', error);
    throw error;
  }
}

// 증권사의 각 주식 종목 자산 개요 불러오기
export async function get2(ssafyUserId: string, stockAccountId: string) {
  try {
    const response = await axios.get<get2Interface>(`/stock/${ssafyUserId}/${stockAccountId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error fetching get1:', error);
    throw error;
  }
}

// 현재 전체 자산 조회
export async function getTotalAsset(userId: string) {
  try {
    const response = await axios.get<getTotalAssetInterface>(`/asset?userId=${userId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error fetching get3:', error);
    throw error;
  }
}

// 예적금 계좌 정보 조회
export async function getDepositSaving(userId: string) {
  try {
    const response = await axios.get<getTotalAssetInterface>(`/asset/deposit?userId=${userId}`);
    console.log(response);
    return response
  } catch (error) {
    console.error('Error fetching getDepositSaving:', error);
    throw error;
  }
}

// 예적금 계좌별 입출금 조회
export async function getTransaction(type: string, accountId: string) {
  try {
    const response = await axios.get<getTransactionInterface>(`/asset/deposit/${type}/${accountId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.log('Error fetching getTransaction:', error)
    throw error
  }
}

// 수시입출금 계좌 정보 조회
export async function getAccount(userId: string) {
  try {
    const response = await axios.get<getTotalAssetInterface>(`/asset/account?userId=${userId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error fetching getAccount:', error);
    throw error;
  }
}

// 수시입출금 계좌별 입출금 조회
export async function get7(accountId: string) {
  try {
    const response = await axios.get<get7Interface>(`/asset/account/${accountId}`);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error fetching get7:', error);
    throw error;
  }
}

// 자산 연동
export async function get8() {
  try {
    const response = await axios.get(`/`);
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error fetching get8:', error);
    throw error;
  }
}

export default {
  get1,
  get2,
  getTotalAsset,
  getDepositSaving,
  getTransaction,
  getAccount,
  get7,
  get8,
};