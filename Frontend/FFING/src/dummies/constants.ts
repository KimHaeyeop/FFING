// User constants
export const USER_KEY = "2742ecf5-e05b-45f7-9513-904130fcc763";
export const USER_ID = 1;

// Card constants
export const CARD_NO = "1003286203382528";
export const CARD_CVC = "575";

// Account constants
export const DEPOSIT_ACCOUNT_NO = "0012641595951940";
export const WITHDRAWAL_ACCOUNT_NO = "0015630549725747";

// Transaction constants
export const DEFAULT_WITHDRAWAL_SUMMARY = "김싸피";
export const DEFAULT_TRANSACTION_MEMO = "월세";

// Category constants
export const CATEGORIES = [
  "FINANCE",
  "FOOD_BAKERY",
  "LIFE_CULTURE",
  "SHOPPING",
  "TRANSPORTATION",
  "OVERSEAS",
] as const;

export type CategoryType = (typeof CATEGORIES)[number];
