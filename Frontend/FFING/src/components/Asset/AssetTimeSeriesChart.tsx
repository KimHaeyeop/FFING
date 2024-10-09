import { Display } from "phaser";
import React from "react";
import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

const AssetTimeSeriesChart: React.FC = () => {
  const config = {
    data: {
      // API를 통해 이번 달 정보 가져오기
      labels: ["5월", "6월", "7월", "8월", "9월", "10월"],
      datasets: [
        {
          // API 연동 필요
          data: [7000000, 9000000, 5000000, 7000000, -2000000, -10000000],
          backgroundColor: [
            "#B1B1B1",
            "#B1B1B1",
            "#B1B1B1",
            "#B1B1B1",
            "#B1B1B1",
            "#C8A1E0",
          ],
          borderRadius: 5, // 바의 모서리 둥글기
        },
      ],
    },
    options: {
      responsive: false, // 화면 크기는 내가 조정함
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false, // x축 배경 grid 삭제
          },
          border: {
            display: true,
            width: 0,
            z: 1,
          },
          ticks: {
            font: {
              family: "'Galmuri11'",
              size: 14, // 레이블 폰트 크기 설정
            },
          },
        },
        y: {
          display: false,
          grid: {
            display: false, // y축 배경 grid를 유지하되,
            drawBorder: false, // y축 테두리 제거
            drawTicks: false, // y축 눈금 제거
            color: (context) =>
              context.tick.value === 0 ? "#D9D9D9" : "rgba(0, 0, 0, 0)", // y=0에서만 선을 표시하고 나머지는 투명
            lineWidth: (context) => (context.tick.value === 0 ? 2 : 0), // y=0에서 x축만 강조
          },
          ticks: {
            display: false, // y축 인덱스 삭제
          },
        },
      },
    },
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Bar {...config} />
    </div>
  );
};

export default AssetTimeSeriesChart;
