import axios from "./AxiosConfig";

// // 현재 보유 중인 증권사별 자산 개요 인터페이스
export interface getStocksInterface {
  ssafyUserId: string;
}

// 증권사의 각 주식 종목 자산 개요 인터페이스
export interface getStockDetailInterface {
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
export interface getAcTransactionInterface {
  accountId: string;
}

// 현재 보유 중인 증권사별 자산 개요 불러오기
export async function getStocks(ssafyUserId: string) {
  try {
    const response = await axios.get<getStocksInterface>(`/stock/${ssafyUserId}`);
    return response;
  } catch (error) {
    console.error('Error fetching getStocks:', error);
    throw error;
  }
}

// 증권사의 각 주식 종목 자산 개요 불러오기
export async function getStockDetail(ssafyUserId: string, stockAccountId: string) {
  try {
    const response = await axios.get<getStockDetailInterface>(`/stock/${ssafyUserId}/${stockAccountId}`);
    return response;
  } catch (error) {
    console.error('Error fetching get stock detail:', error);
    throw error;
  }
}

// 현재 전체 자산 조회
export async function getTotalAsset(userId: string) {
  try {
    const response = await axios.get<getTotalAssetInterface>(`/asset?userId=${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching total asset:', error);
    throw error;
  }
}

// 예적금 계좌 정보 조회
export async function getDepositSaving(userId: string) {
  try {
    const response = await axios.get<getTotalAssetInterface>(`/asset/deposit?userId=${userId}`);
    return response
  } catch (error) {
    console.error('Error fetching getDepositSaving:', error);
    throw error;
  }
}

// 예적금 계좌별 입출금 조회
export async function getDsTransaction(type: string, accountId: string) {
  try {
    const response = await axios.get<getTransactionInterface>(`/asset/deposit/${type}/${accountId}`);
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
    return response;
  } catch (error) {
    console.error('Error fetching getAccount:', error);
    throw error;
  }
}

// 수시입출금 계좌별 입출금 조회
export async function getAcTransaction(accountId: string) {
  try {
    const response = await axios.get<getAcTransactionInterface>(`/asset/account/${accountId}`);
    return response;
  } catch (error) {
    console.error('Error fetching getAcTransaction:', error);
    throw error;
  }
}

// 메인 페이지 API 획득 정보 조회
export async function getDashBoardMain(userId: string) {
  try {
    const response = await axios.get<getTotalAssetInterface>(`/dashboard/main?userId=${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching get Main Dashboard data:', error);
    throw error;
  }
}

// 자산 연동
export async function get8() {
  try {
    const response = await axios.get(`/`);
    return response;
  } catch (error) {
    console.error('Error fetching get8:', error);
    throw error;
  }
}

export default {
  getStocks,
  getStockDetail,
  getTotalAsset,
  getDepositSaving,
  getDsTransaction,
  getAccount,
  getAcTransaction,
  get8,
};