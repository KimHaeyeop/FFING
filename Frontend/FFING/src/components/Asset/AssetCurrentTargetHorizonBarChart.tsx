import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AssetCurrentTargetHorizonBarChart: React.FC = () => {
  const [property, setProperty] = React.useState(100000);
  const [target, setTarget] = React.useState(1000000);

  // // 이번 달 지출액을 가져오는 함수
  // const fetchData = async () => {
  //   try {
  //     // 적절한 유저 이름 설정 필요
  //     const response = await getTotalAsset('1');
  //     console.log(response)
  //     // setProperty(response.data.result.totalExpense);
  //     // setTarget(response.data.result.totalExpense)
  //   } catch (error) {
  //     console.error('Error fetching certain spending data:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const data = {
    labels: ['달성'],
    datasets: [
      {
        data: [property],
        backgroundColor: '#BBEAED',
        barThickness: 30, // 막대 두께 설정
      },
      {
        data: [target],
        backgroundColor: '#828181',
        barThickness: 30, // 막대 두께 설정
      },
    ],
  };

  const options = {
    indexAxis: 'y', // 수평 바 차트
    responsive: false,
    plugins: {
      legend: {
        display: false, // 범례 숨기기
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

export default AssetCurrentTargetHorizonBarChart;