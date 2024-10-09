// 1. 현재 연도(YYYY 형태의 문자열)을 반환하는 함수
export const getCurrentYear = (): string => {
  const now = new Date();
  return now.getFullYear().toString();
};

// 2. 현재 연월(YYYYMM 형태의 문자열)을 반환하는 함수
export const getCurrentYearMonth = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}${month}`;
};

// 3. 현재 월(MM 형태의 문자열, ex)9월은 '9')을 반환하는 함수
export const getCurrentMonth = (): string => {
  const now = new Date();
  return (now.getMonth() + 1).toString();
};

// 4. 현재 연월일(YYYYMMDD)을 반환하는 함수
export const getCurrentYearMonthDay = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};
