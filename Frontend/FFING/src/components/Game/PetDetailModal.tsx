import React from "react";
import { Radar } from "react-chartjs-2";
import Icon from "@mdi/react";
import {
  mdiFoodForkDrink,
  mdiTheater,
  mdiSubwayVariant,
  mdiFinance,
  mdiShopping,
} from "@mdi/js";
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
    금융: financeStat,
    식비: foodBakeryStat,
    생활: lifeCultureStat,
    쇼핑: shoppingStat,
    교통: transportationStat,
  };

  const typeColorMap: { [key: string]: { background: string; icon: string } } =
    {
      식비: {
        background: "bg-red-100",
        icon: mdiFoodForkDrink,
      },
      쇼핑: {
        background: "bg-yellow-100",
        icon: mdiShopping,
      },
      생활: {
        background: "bg-green-100",
        icon: mdiTheater,
      },
      교통: {
        background: "bg-blue-100",
        icon: mdiSubwayVariant,
      },
      금융: {
        background: "bg-purple-100",
        icon: mdiFinance,
      },
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
      tooltip: {
        enabled: false, // 툴팁 비활성화
      },
    },
    scales: {
      r: {
        grid: {
          display: true, // 그리드 라인 보이기
        },
        ticks: {
          display: false, // 차트 안의 숫자 라벨(10, 20, 30) 삭제
        },
        angleLines: {
          display: true, // 각도선 보이기
        },
        suggestedMin: 0,
        suggestedMax: 10,
        pointLabels: {
          padding: 0,
          font: {
            size: 15,
            weight: "bold",
            family: "Galmuri11-Bold", // Apply the font here
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

        {/* 펫 특성 (Chip 형태) */}
        <div
          className={`mt-12 font-galmuri-11-bold ${typeColorMap[petTrait].background} px-3 py-1 rounded-full inline-flex mx-auto`}
        >
          <p>{petTrait}</p>
          <Icon path={typeColorMap[petTrait].icon} size={1} color={"#000000"} />
        </div>

        {/* 상단의 둥근 원형 영역 */}
        <div
          className={`${typeColorMap[petTrait].background} w-36 h-36 rounded-full mt-4 flex justify-center items-center mx-auto`}
        >
          <div>
            <PetSprite imageUrl={petImageUrl} isUnlocked={true} />
            <span className="text-sm text-gray-500">{petCode}</span>
          </div>
        </div>

        {/* 펫 이름과 도감 인덱스 */}
        <div className="mt-4 flex justify-around px-1 items-center">
          <h2 className="text-xl font-galmuri-11-bold">{petName}</h2>
        </div>

        {/* 레이더 차트 (펫 능력치) */}
        <div className="flex-grow mt-4 flex justify-center items-center mb-4">
          {/* 레이더 차트 */}
          <div style={{ width: "100%", height: "100%", maxHeight: "220px" }}>
            <Radar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailModal;
