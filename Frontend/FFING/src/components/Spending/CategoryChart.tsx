import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts, ChartEvent, ActiveElement, Chart } from 'chart.js';
import { getThisMonthCategorySpending } from '../../api/SpendingApi';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MonthlyCategorySpending {
  category: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  target: number;
}


interface SpendingCategoryChartProps {
  onClick: (category: string) => void; // 카테고리를 클릭했을 때 호출하는 함수
}

const SpendingCategoryChart: React.FC<SpendingCategoryChartProps> = ({ onClick }) => {
  // 누른 카테고리를 강조하기 위한 상태 관리
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);
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
  const filteredData = spendingData
  .filter(item => item.category !== 'OVERSEAS')
  .sort((a, b) => b.totalAmount - a.totalAmount); // 차트 정렬하기

  // 클릭 시 카테고리 필터링 및 전달하는 함수
  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>, elements: ActiveElement[]) => {
    // 다른 곳을 클릭하면
    if (elements.length > 0) {
      const chart = elements[0].element.$context.chart;
      const index = elements[0].index;
      const categoryLabel = chart.data.labels[index];
      const category = Object.keys(mapKrUs).find(key => mapKrUs[key] === categoryLabel);  // 카테고리 매핑
      setHighlightedCategory(category)  // 클릭된 카테고리 강조
      onClick(category); // 카테고리 전달
    } else {
      onClick('') // 클릭 안 된 경우 빈 값 전달
    }
  };  

  const config = {
    data: {
      labels: [...filteredData.map((item) => mapKrUs[item.category])],
      datasets: [
        {
          label: '총 지출 대비(%)',
          data: [...filteredData.map((item) => item.totalAmount)],
          backgroundColor: [
            '#80B2FF',
            '#FF80EB',
            '#FFCC80',
            '#FF808F',
            '#80FF8D',
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
            generateLabels: (chart: Chart) => {
              const data = chart.data
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i]
                const formattedValue  = value.toLocaleString(undefined, {maximumFractionDigits: 0})
                return {
                  text: `${label} ${formattedValue}원`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  class: label === highlightedCategory ? 'font-galmuri-11-bold' : '', // 이거 아직 안 되서 수정해야 함
                }
              })
            }
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      // 클릭하면 해당 부분이 확대되고 해당 항목의 거래 내역만 렌더링
      onClick: handleClick,
    }
  }
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Doughnut {...config} />
    </div>
  );
};

export default SpendingCategoryChart;
