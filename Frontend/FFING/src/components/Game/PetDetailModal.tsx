import React from 'react';
import { Radar } from "react-chartjs-2";
import 'chart.js/auto';
import Modal from '../Common/Modal';
import PetSprite from './PetSprite';

interface PetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  petIndex: number; // 이것도 자체적으로 펫 인덱스가 있을 수도 있다.
  petImageUrl: string;
  petTrait: string; // 특성이 여러 개일수도 있어서 배열로 바뀔 수도 있다. 아니면 펫 상세 정보에서 trait도 가지고 있을 수도 있다.
}

const PetDetailModal: React.FC<PetDetailModalProps> = ({
  isOpen,
  onClose,
  petName,
  petIndex,
  petImageUrl,
  petTrait,
}) => {
  const currentWeek = { 식비: 6, 쇼핑: 8, 교통: 6, 생활: 6, 문화: 6 };
  const previousWeek = { 식비: 8, 쇼핑: 6, 교통: 6, 생활: 8, 문화: 8 };

  const labels = ['식비', '쇼핑', '교통', '생활', '문화'];

  const data = {
    labels,
    datasets: [
      {
        label: '이번 주',
        data: Object.values(currentWeek),
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // 파란색
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: '저번 주',
        data: Object.values(previousWeek),
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // 빨간색
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,  // 차트 위에 라벨을 숨김
      },
    },
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 10,
        ticks: {
          stepSize: 2,          // 각 능력치 간격 조정
          backdropPadding: 0,    // 레이블과 배경 패딩 없앰
          max: 10,               // 최대값 설정
          min: 0,                // 최소값 설정
        },
        pointLabels: {
          padding: 0,           // 능력치 레이블과 중앙 사이 간격 줄임
          font: {
            size: 10,
            weight: 'bold'
          }
        },
      },
    },
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* 상단의 둥근 원형 영역 */}
        <div className="w-24 h-24 bg-[#BBBBBB] rounded-full -mt-12 flex justify-center items-center relative z-10">
          <PetSprite imageUrl={petImageUrl} isUnlocked={true}/>
        </div>

        {/* 펫 이름과 도감 인덱스 */}
        <div className="mt-6 flex items-center">
          <h2 className="text-lg font-bold mr-4">{petName}</h2>
          <span className="text-gray-500">No.{petIndex}</span>
        </div>

        {/* 펫 특성 (Chip 형태 속성에 따라서 색상을 바꾸긴 해야 함?) */}
        <div className="mt-2 bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
          {petTrait}
        </div>

        {/* 레이더 차트 (펫 능력치) */}
        <div className="mt-6 w-full">
          <div className="flex justify-center items-center">
            {/* 카드 스타일 적용 */}
            <div className="shadow-lg rounded-lg p-0 max-w-4xl w-full flex flex-row">
              {/* 레이더 차트 */}
              <div className="w-2/3 flex justify-center items-center p-1">
                <Radar data={data} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PetDetailModal;