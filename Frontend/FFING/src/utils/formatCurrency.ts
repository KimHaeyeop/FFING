// 화폐 단위에 맞게 렌더링할 수 있게 값을 반환하는 함수
export const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `${(value / 100000000).toLocaleString()}억 원`;
  } else if (value >= 10000) {
    return `${(value / 10000).toLocaleString()}만 원`;
  } else {
    return `${value.toLocaleString()}원`;
  }
};
