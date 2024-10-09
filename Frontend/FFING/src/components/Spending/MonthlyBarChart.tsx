import React from 'react';
import { Bar } from 'react-chartjs-2';
import { getCurrentYear, getCurrentMonth } from '../../utils/dataUtils';

interface MonthlyBarChartProps {
  chartData: number[] // 숫자로 이루어진 배열
}

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ chartData }) => {

  // 5개월 전 ~ 현재까지의 'MM월' 형태의 리스트를 만드는 함수
  const generateLastSixMonthsLabels = (): string[] => {
    const currentMonth = parseInt(getCurrentMonth(), 10);
    const labels: string[] = [];
  
    for (let i = 5; i >= 0; i--) {
      const month = currentMonth - i;
      if (month > 0) {
        labels.push(`${month}월`);
      } else {
        labels.push(`${12 + month}월`);
      }
    }
  
    return labels;
  };


  const config = {
    data: {
      labels: generateLastSixMonthsLabels(),
      datasets: [
        {
          data: chartData,
          backgroundColor: [
            '#B1B1B1',
            '#B1B1B1',
            '#B1B1B1',
            '#B1B1B1',
            '#B1B1B1',
            '#C8A1E0',
          ],
          borderRadius: 5,  // 바의 모서리 둥글기
        },
      ], 
    },
    options: {
      responsive: false, // 화면 크기는 내가 조정함
      plugins: {
        legend: {
          display: false,
        }
      },
      scales: {
        x: {
          grid: {
            display: false, // x축 배경 grid 삭제
          },
          border: {
            display: true,
            width: 5, // x축 선 두께
            z: 1,
          },
        },
        y: {
          grid: {
            display: false, // y축 배경 grid 삭제
          },
          ticks: {
            display: false, // y축 인덱스 삭제
          },
          border: {
            display: false,
          }
        }
      }
    }
  }
  
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Bar {...config} />
    </div>
  );
};

export default MonthlyBarChart;
