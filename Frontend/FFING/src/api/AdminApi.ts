import axios from "./AxiosConfig";

// 카드 결제 내역 인터페이스
export interface CardTransactionData {
  userKey: string;
  userId: number;
  category: string;
  cardNo: string;
  cvc: string;
  merchantId: number;
  paymentBalance: number;
}

// 계좌 이체 내역 인터페이스
export interface AccountTransactionData {
  userKey: string;
  userId: number;
  depositAccountNo: string;
  withdrawalAccountNo: string;
  transactionBalance: number;
  withdrawalTransactionSummary: string;
  transactionMemo: string;
}

// 카드 결제
export const sendCardTransaction = async (data: CardTransactionData) => {
  try {
    const response = await axios.post("/admin/cardTransaction", data);
    console.log("Transaction successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending card transaction:", error);
    throw error;
  }
};

// 계좌 이체
export const sendAccountTransaction = async (data: AccountTransactionData) => {
  try {
    const response = await axios.post("/admin/accountTransfer", data);
    console.log("Transfer successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to send account transaction", error);
    throw error;
  }
};
