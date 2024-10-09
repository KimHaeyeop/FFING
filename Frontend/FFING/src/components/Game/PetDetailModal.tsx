import React from 'react';
import { Radar } from "react-chartjs-2";
import Icon from '@mdi/react';
import { mdiFoodForkDrink, mdiTheater, mdiSubwayVariant, mdiFinance, mdiShopping } from '@mdi/js'
import 'chart.js/auto';
import PetSprite from './PetSprite';
import useViewportStore from '../../store/useViewportStore';

interface PetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  petCode: string;
  petImageUrl: string;
  petTrait: string;
  totalStat: number
  financeStat: number
  foodBakeryStat: number
  lifeCultureStat: number
  shoppingStat: number
  transportationStat: number
}

const PetDetailModal: React.FC<PetDetailModalProps> = ({
  isOpen,
  onClose,
  petName,
  petCode,
  petImageUrl,
  petTrait,
  totalStat,
  financeStat,
  foodBakeryStat,
  lifeCultureStat,
  shoppingStat,
  transportationStat
}) => {

  const dvw = useViewportStore((state) => state.dvw); 
  const dvh = useViewportStore((state) => state.dvh);

  const currentWeek = { '금융': financeStat, '식비': foodBakeryStat, '생활': lifeCultureStat, '쇼핑': shoppingStat, '교통': transportationStat };
  
  const typeColorMap: { [key: string]: { background: string, icon: string } } = {
    '식비': {
      'background': 'bg-red-100',
      'icon': mdiFoodForkDrink,
    },
    '쇼핑': {
      'background': 'bg-yellow-100',
      'icon': mdiShopping,
    },
    '생활': {
      'background': 'bg-teal-100',
      'icon': mdiTheater,
    },
    '교통': {
      'background': 'bg-green-100',
      'icon': mdiSubwayVariant,
    },
    '금융': {
      'background': 'bg-blue-100',
      'icon': mdiFinance,
    },
  };

  const labels = ['식비', '쇼핑', '교통', '생활/문화', '금융'];

  const data = {
    labels,
    datasets: [
      {
        label: '이번 주',
        data: Object.values(currentWeek),
        backgroundColor: 'rgba(54, 162, 235, 0.2)', 
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: false,
    plugins: {
      legend: {
        display: false,
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
          stepSize: 2,
          max: 10,
          min: 0,
        },
        pointLabels: {
          padding: 0,
          font: {
            size: 10,
            weight: 'bold'
          }
        },
      },
    },
  };

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      {/* 모달 창 */}
      <div className="bg-white rounded-lg border-4 border-gray-400 relative"
        style={{
          width: `${60 * dvw}px`,   // dvw를 활용해 모달 너비 설정
          height: `${70 * dvh}px`,  // dvh를 활용해 모달 높이 설정
        }}
      >
        {/* 모달 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700"
        >
          X
        </button>
        
        {/* 상단의 둥근 원형 영역 */}
        <div 
          className={`${typeColorMap[petTrait].background} w-48 h-48 rounded-full mt-12 flex justify-center items-center mx-auto relative`}
        >
          {/* 중앙 정렬된 아이콘 */}
          <div className="absolute inset-0 flex justify-center items-center z-10">
            <Icon path={typeColorMap[petTrait].icon} size={5} color={'#FFFFFF'}/>
          </div>
          <div className='z-20'>
            <PetSprite imageUrl={petImageUrl} isUnlocked={true} />
          </div>
        </div>

        {/* 펫 이름과 도감 인덱스 */}
        <div className="mt-[5%] flex justify-around px-1 items-center">
          <h2 className="text-xl font-bold mr-4">{petName}</h2>
          <span className="text-sm text-gray-500">{petCode}</span>
        </div>

        {/* 펫 특성 (Chip 형태) */}
        <div className={`mt-3 ${typeColorMap[petTrait].background} px-3 py-1 rounded-full inline-flex`}>
          {petTrait}
        </div>

        {/* 레이더 차트 (펫 능력치) */}
        <div className="mt-6 flex justify-center items-center">
          {/* 레이더 차트 */}
          <div
            style={{
              height: `${70 * 0.4 * dvh}px`,  // dvh를 기반으로 차트 높이 설정
              width: `${70 * dvw}px`,   // dvw를 기반으로 차트 너비 설정
              // maxHeight: '100%',        // 모달을 벗어나지 않게 최대 높이 설정
              // maxWidth: '100%'          // 모달을 벗어나지 않게 최대 너비 설정
            }}>
            <Radar 
              data={data}
              options={options}
              className='mx-auto'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailModal;
