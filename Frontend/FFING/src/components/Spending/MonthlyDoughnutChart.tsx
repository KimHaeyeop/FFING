import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts, Chart } from 'chart.js';
import { getThisMonthCategorySpending } from '../../api/SpendingApi';


ChartJS.register(ArcElement, Tooltip, Legend);

interface MonthlyCategorySpending {
  category: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  target: number;
}

const MonthlyDoughnutChart: React.FC = () => {
  const [spendingData, setSpendingData] = useState<MonthlyCategorySpending[]>([]);

  // 카테고리 별 지출액을 가져오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getThisMonthCategorySpending();
        setSpendingData(response.data.result); // 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching spending data:', error);
      }
    };
    fetchData();
  }, []);

  // API 연동 필요
  const targetSpending = 100000

  // FINANCE, FOOD_BAKERY, LIFE_CULTURE, SHOPPING, TRANSPORTATION, OVERSEAS
  // key를 문자열로 사용 가능하게 변경
  const mapKrUs: { [key: string]: string } = {
    'FINANCE': '금융',
    'FOOD_BAKERY': '음식/외식',
    'LIFE_CULTURE': '생활/문화',
    'SHOPPING': '쇼핑',
    'TRANSPORTATION': '교통',
  }

  // 해외 카테고리 삭제 전까지 이 걸로 진행해야 함
  const filteredData = Array.isArray(spendingData)
  ? spendingData
      .filter(item => item.category !== 'OVERSEAS')
      .sort((a, b) => b.totalAmount - a.totalAmount) // 차트 정렬하기
  : []; // 값이 없으면 빈배열 반환

  const config = {
    data: {
      labels: [...filteredData.map((item) => mapKrUs[item.category]), '잔여'],
      datasets: [
        {
          label: '총 지출 대비(%)',
          data: [...filteredData.map((item) => item.totalAmount), targetSpending],
          backgroundColor: [
            '#80B2FF',
            '#FF80EB',
            '#FFCC80',
            '#FF808F',
            '#80FF8D',
            '#FFFFFF',
          ],
        },
      ],
    },
    // 차트 중앙에 자금 초과 여부 렌더링 필요
    // 범례 label과 value 사이의 거리 이격 필요
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: 'right' as const, // 차트 오른편에 범례
          labels: {
            boxWidth: 15, // 범례 색상 공간의 너비 수정
            // 범례 색상의 테두리 삭제 필요
            generateLabels: (chart: Chart) => { // chart의 타입 지정
              const data = chart.data;
              return data.labels!.map((label, i) => {
                const value = data.datasets![0].data[i] as number;
                const total = data.datasets![0].data.reduce((a, b) => (a as number) + (b as number), 0);
                const percentage = ((value / total) * 100).toFixed(2); // 소수점 둘째자리까지 출력
                return {
                  text: `${label} ${percentage}%`,
                  fillStyle: data.datasets![0].backgroundColor[i] as string,
                  hidden: false,
                };
              });
            },
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    },
  };
  
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Doughnut {...config} />
    </div>
  );
};

export default MonthlyDoughnutChart;
