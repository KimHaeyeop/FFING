import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom'
import { ChartEvent, LegendItem } from 'chart.js';  // chart.js 안에 chart의 타입이 있다.
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, layouts } from 'chart.js';
// ChartJS.register(ArcElement, Tooltip, Legend);

const AssetPortfolioHorizontalBarChart: React.FC = () => {
  const navigate = useNavigate()

  const data = {
    labels: ['자산 구성'],
    datasets: [
      {
        label: '예금/적금',
        data: [60],
        backgroundColor: '#7C00FE',
      },
      {
        label: '입출금 통장',
        data: [10],
        backgroundColor: '#F9E400',
      },
      {
        label: '주식',
        data: [20],
        backgroundColor: '#FFAF00',
      },
      {
        label: '기타 자산',
        data: [10],
        backgroundColor: '#F5004F',
      },
    ],
  };

  const options = {
    indexAxis: 'y', // 수평 바 차트
    responsive: false,
    plugins: {
      legend: {
        position: 'bottom' as const, // 차트 아래에 범례
        onClick: (e: ChartEvent, legendItem: LegendItem) => {
          const text = legendItem.text
          navigate('product', { state: { text }});
        },
      },
    },
    title: {
      display: false, // 차트 제목 숨기기
    },
    scales: {
      x: {
        grid: {
          display: false, // x축 배경 grid 삭제
        },
        stacked: true,
        ticks: {
          display: false, // x축 인덱스 삭제
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false, // y축 배경 grid 삭제
        },
        stacked: true,
        ticks: {
          display: false, // y축 인덱스 삭제
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Bar data={data} options={options} />
    </div>
  );
};

export default AssetPortfolioHorizontalBarChart;
