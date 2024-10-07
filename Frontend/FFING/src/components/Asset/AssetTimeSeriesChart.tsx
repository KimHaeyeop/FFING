import React from 'react';
import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

const AssetTimeSeriesChart: React.FC = () => {
  const config = {
    data: {
      // API를 통해 이번 달 정보 가져오기
      labels: ['5월', '6월', '7월', '8월', '9월', '10월'],
      datasets: [
        {
          // API 연동 필요
          data: [7000000, 9000000, 5000000, 7000000, -2000000, -10000000],
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

export default AssetTimeSeriesChart;
