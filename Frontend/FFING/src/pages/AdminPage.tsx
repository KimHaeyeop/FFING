import React, { useState, useEffect } from "react";
import {
  CardTransactionData,
  AccountTransactionData,
  sendCardTransaction,
  sendAccountTransaction,
} from "../api/AdminApi";
import { categories, Merchant } from "../dummies/categoryData";
import {
  USER_KEY,
  USER_ID,
  CARD_NO,
  CARD_CVC,
  DEPOSIT_ACCOUNT_NO,
  WITHDRAWAL_ACCOUNT_NO,
  DEFAULT_WITHDRAWAL_SUMMARY,
  DEFAULT_TRANSACTION_MEMO,
  CATEGORIES,
} from "../dummies/constants";

const AdminPage: React.FC = () => {
  const [cardFormData, setCardFormData] = useState<CardTransactionData>({
    userKey: USER_KEY,
    userId: USER_ID,
    category: "",
    merchantId: 0,
    cardNo: CARD_NO,
    cvc: CARD_CVC,
    paymentBalance: 0,
  });

  const [accountFormData, setAccountFormData] =
    useState<AccountTransactionData>({
      userKey: USER_KEY,
      userId: USER_ID,
      depositAccountNo: DEPOSIT_ACCOUNT_NO,
      withdrawalAccountNo: WITHDRAWAL_ACCOUNT_NO,
      transactionBalance: 0,
      withdrawalTransactionSummary: DEFAULT_WITHDRAWAL_SUMMARY,
      transactionMemo: DEFAULT_TRANSACTION_MEMO,
    });

  const [availableMerchants, setAvailableMerchants] = useState<Merchant[]>([]);

  useEffect(() => {
    if (cardFormData.category) {
      const merchantsForCategory = categories.flatMap((cat) => cat.merchants);
      setAvailableMerchants(merchantsForCategory);
    } else {
      setAvailableMerchants([]);
    }
  }, [cardFormData.category]);

  const handleCardFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCardFormData((prev) => ({
      ...prev,
      [name]:
        name === "userId" || name === "paymentBalance"
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleAccountFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAccountFormData((prev) => ({
      ...prev,
      [name]:
        name === "userId" || name === "transactionBalance"
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleCardSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await sendCardTransaction(cardFormData);
      console.log("Card transaction result:", result);
      alert("Card transaction successful!");
    } catch (error) {
      console.error("Card transaction failed:", error);
      alert("Card transaction failed. Please try again.");
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await sendAccountTransaction(accountFormData);
      console.log("Account transaction result:", result);
      alert("Account transaction successful!");
    } catch (error) {
      console.error("Account transaction failed:", error);
      alert("Account transaction failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-20">Admin Page</h1>

      <h2 className="text-xl font-semibold mb-8">카드결제</h2>
      <form onSubmit={handleCardSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block mb-1">
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={cardFormData.category}
              onChange={handleCardFormChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="merchantId" className="block mb-1">
              Merchant:
            </label>
            <select
              id="merchantId"
              name="merchantId"
              value={cardFormData.merchantId}
              onChange={handleCardFormChange}
              required
              className="w-full p-2 border rounded"
              disabled={!cardFormData.category}
            >
              <option value="">Select a merchant</option>
              {availableMerchants.map((merchant) => (
                <option key={merchant.merchantId} value={merchant.merchantId}>
                  {merchant.merchantName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cardNo" className="block mb-1">
              Card Number:
            </label>
            <input
              type="text"
              id="cardNo"
              name="cardNo"
              value={cardFormData.cardNo}
              onChange={handleCardFormChange}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="cvc" className="block mb-1">
              CVC:
            </label>
            <input
              type="text"
              id="cvc"
              name="cvc"
              value={cardFormData.cvc}
              onChange={handleCardFormChange}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>
        <div>
          <label htmlFor="paymentBalance" className="block mb-1">
            Payment Balance:
          </label>
          <input
            type="number"
            id="paymentBalance"
            name="paymentBalance"
            value={cardFormData.paymentBalance}
            onChange={handleCardFormChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
          >
            Submit Card Transaction
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-8">계좌이체</h2>
      <form onSubmit={handleAccountSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="depositAccountNo" className="block mb-1">
              Deposit Account No:
            </label>
            <input
              type="text"
              id="depositAccountNo"
              name="depositAccountNo"
              value={accountFormData.depositAccountNo}
              onChange={handleAccountFormChange}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="withdrawalAccountNo" className="block mb-1">
              Withdrawal Account No:
            </label>
            <input
              type="text"
              id="withdrawalAccountNo"
              name="withdrawalAccountNo"
              value={accountFormData.withdrawalAccountNo}
              onChange={handleAccountFormChange}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>
        <div>
          <label htmlFor="transactionBalance" className="block mb-1">
            Transaction Balance:
          </label>
          <input
            type="number"
            id="transactionBalance"
            name="transactionBalance"
            value={accountFormData.transactionBalance}
            onChange={handleAccountFormChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="withdrawalTransactionSummary" className="block mb-1">
            Withdrawal Transaction Summary:
          </label>
          <input
            type="text"
            id="withdrawalTransactionSummary"
            name="withdrawalTransactionSummary"
            value={accountFormData.withdrawalTransactionSummary}
            onChange={handleAccountFormChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="transactionMemo" className="block mb-1">
            Transaction Memo:
          </label>
          <input
            type="text"
            id="transactionMemo"
            name="transactionMemo"
            value={accountFormData.transactionMemo}
            onChange={handleAccountFormChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-4"
          >
            Submit Account Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;
