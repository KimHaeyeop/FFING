import React from 'react';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingCategoryChartProps {
  chartData: number[] // 숫자로 이루어진 배열
  onClick: (category: string) => void; // 카테고리를 클릭했을 때 호출하는 함수
}



const SpendingCategoryChart: React.FC<SpendingCategoryChartProps> = ({ chartData, onClick }) => {

  // 누른 카테고리를 강조하기 위한 상태 관리
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(null);

  const data = {
    labels: ['식비', '교통', '쇼핑', '생활/문화', '금융', '잔여'],
    datasets: [
      {
        label: '총 지출 대비(%)',
        data: chartData,  // API 받아오면 실제 값으로 변경해야 함?
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
  };

  // 차트를 클릭했을 때, SpendingCategoryPage에 카테고리를 전달하는 함수
  const handleClick = (event, elements) => {
    // 다른 곳을 클릭하면
    if (elements.length > 0) {
      const chart = elements[0].element.$context.chart;
      const index = elements[0].index;
      const category = chart.data.labels[index];
      setHighlightedCategory(category)  // 강조할 카테고리 선정
      onClick(category); // 클릭한 카테고리 전달
    } else {
      onClick('')
    }
  };  

  // 차트 중앙에 자금 초과 여부 렌더링 필요
  // 범례 label과 value 사이의 거리 이격 필요
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const, // 차트 오른편에 범례
        labels: {
          boxWidth: 15, // 범례 색상 공간의 너비 수정
          // 범례 색상의 테두리 삭제 필요
          generateLabels: (chart) => {
            const data = chart.data
            return data.labels.map((label, i) => {
              const value = data.datasets[0].data[i]
              const formattedValue  = value.toLocaleString()
              return {
                text: `${label} ${formattedValue}`,
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
  };
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default SpendingCategoryChart;
