import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MonthlyDoughnutChartProps {
  chartData: number[] // 숫자로 이루어진 배열
}

const MonthlyDoughnutChart: React.FC<MonthlyDoughnutChartProps> = ({chartData}) => {
  const data = {
    labels: ['식비', '교통', '쇼핑', '문화', '생활', '잔여'],
    datasets: [
      {
        label: '총 지출 대비(%)',
        data: chartData,
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
              const total = data.datasets[0].data.reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(2) // 소수점 둘째자리까지 출력
              return {
                text: `${label} ${percentage}%`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
              }
            })
          }
        },
      },
      tooltip: {
        enabled: false,
      },
    },
  };
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default MonthlyDoughnutChart;
