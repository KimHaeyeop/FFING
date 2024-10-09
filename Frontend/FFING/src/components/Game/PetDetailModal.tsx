import React from "react";
import { Radar } from "react-chartjs-2";
import "chart.js/auto";
import PetSprite from "./PetSprite";
import useViewportStore from "../../store/useViewportStore";

interface PetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  petCode: string;
  petImageUrl: string;
  petTrait: string;
  totalStat: number;
  financeStat: number;
  foodBakeryStat: number;
  lifeCultureStat: number;
  shoppingStat: number;
  transportationStat: number;
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
  transportationStat,
}) => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  const currentWeek = {
    식비: financeStat,
    쇼핑: foodBakeryStat,
    교통: lifeCultureStat,
    생활: shoppingStat,
    문화: transportationStat,
  };

  const labels = ["식비", "쇼핑", "교통", "생활/문화", "금융"];

  const data = {
    labels,
    datasets: [
      {
        label: "이번 주",
        data: Object.values(currentWeek),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
            weight: "bold",
          },
        },
      },
    },
  };

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      {/* 모달 창 */}
      <div
        className="bg-white rounded-lg relative flex flex-col"
        style={{
          width: `${80 * dvw}px`, // dvw를 활용해 모달 너비 설정
          height: `${75 * dvh}px`, // dvh를 활용해 모달 높이 설정
        }}
      >
        {/* 모달 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 text-xl"
        >
          x
        </button>

        {/* 상단의 둥근 원형 영역 */}
        <div className="bg-[#BBBBBB] w-48 h-48 rounded-full mt-12 flex justify-center items-center mx-auto">
          <PetSprite imageUrl={petImageUrl} isUnlocked={true} />
        </div>

        {/* 펫 이름과 도감 인덱스 */}
        <div className="mt-4 flex justify-around px-1 items-center">
          <h2 className="text-xl font-bold mr-4">{petName}</h2>
          <span className="text-sm text-gray-500">{petCode}</span>
        </div>

        {/* 펫 특성 (Chip 형태) */}
        <div className="mt-2 bg-blue-200 text-blue-800 px-3 py-1 rounded-full inline-flex self-center">
          {petTrait}
        </div>

        {/* 레이더 차트 (펫 능력치) */}
        <div className="flex-grow mt-4 flex justify-center items-center mb-4">
          {/* 레이더 차트 */}
          <div style={{ width: "100%", height: "100%", maxHeight: "250px" }}>
            <Radar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailModal;
