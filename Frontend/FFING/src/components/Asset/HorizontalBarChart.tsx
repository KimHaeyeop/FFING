import React, {useEffect} from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, LinearScale } from 'chart.js';
import { getTotalAsset } from '../../api/AssetApi';

ChartJS.register(Title, Tooltip, Legend, BarElement, LinearScale);


const HorizontalBarChart: React.FC = () => {
  // API 연동 필요
  const [property, setProperty] = React.useState(100000);
  const [target, setTarget] = React.useState(1000000);

  // 이번 달 지출액을 가져오는 함수
  const fetchData = async () => {
    try {
      // 적절한 유저 이름 설정 필요
      const response = await getTotalAsset('1');
      console.log(response)
      // setProperty(response.data.result.totalExpense);
      // setTarget(response.data.result.totalExpense)
    } catch (error) {
      console.error('Error fetching certain spending data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = {
    labels: ['소비액'],
    datasets: [
      {
        label: '소비액',
        data: [property],
        backgroundColor: '#FFD55E', // 소비액의 색상
        barThickness: 30, // 막대 두께 설정
      },
      {
        label: '목표액',
        data: [target],
        backgroundColor: '#000000', // 목표액의 색상
        barThickness: 30, // 막대 두께 설정
      },
    ],
  };

  const options = {
    indexAxis: 'y', // 수평 바 차트
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: false,  // 화면 크기는 내가 조정함
    plugins: {
      legend: {
        display: false, // 범례 숨기기
      },
      title: {
        display: false, // 차트 제목 숨기기
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // x축 배경 삭제
        },
        stacked: true, // 스택 방식으로 막대 표시
        ticks: {
          display: false, // x축 레이블 숨기기 (필요 시)
        },
        border: {
          display: false, // 가로 축 삭제
        }
      },
      y: {
        grid: {
          display: false, // y축 배경 삭제
        },
        stacked: true, // 스택 방식으로 막대 표시
        ticks: {
          display: false, // x축 레이블 숨기기 (필요 시)
        },
        border: {
          display: false, // 세로 축 삭제
        }
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default HorizontalBarChart;
