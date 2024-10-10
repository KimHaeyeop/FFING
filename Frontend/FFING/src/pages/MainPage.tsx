import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import TextHeader from "../components/Common/TextHeader";
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import MonthlyDoughnutChart from "../components/Spending/MonthlyDoughnutChart";
import PetSprite from "../components/Game/PetSprite";
import RandomPetSpeech from "../components/Common/RandomPetSpeech";
import HorizontalBarChart from "../components/Asset/HorizontalBarChart";
import { initializeFirebaseMessaging } from "../service/firebase";
import { useAuthStore } from "../store/authStore";
import { useDashBoardInfo } from "../hook/useDashBoardInfo";
import { getPetImageUrl } from "../utils/petUtils";
import LockIcon from "../assets/LockIcon.png";
import UnlockIcon from "../assets/UnlockIcon.png";

// New component for the goal setting section
const GoalSettingSection: React.FC<{
  isGoalSet: boolean;
  onSetGoal: () => void;
  goalBalance: number;
  totalAsset: number;
  dvh: number;
}> = ({ isGoalSet, onSetGoal, goalBalance, totalAsset }) => {
  return (
    <div className="border-black border-4 rounded-lg" style={{ height: "25%" }}>
      {isGoalSet ? (
        <>
          <div className="flex justify-between p-2">
            <p className="text-lg mb-3">목표 달성까지</p>
            <Link to="/asset">
              <Icon
                path={mdiChevronRight}
                size={1}
                style={{ color: "#F55322" }}
              />
            </Link>
          </div>
          <div className="flex justify-center">
            <HorizontalBarChart assetDiff={goalBalance - totalAsset} />
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <button
            onClick={onSetGoal}
            className="py-3 px-6 bg-[#CECECE] text-white rounded-md transition duration-300 font-galmuri-11-bold"
          >
            목표 설정하기
          </button>
        </div>
      )}
    </div>
  );
};

// 목표 설정 모달
const GoalSettingModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: number) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [goal, setGoal] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl mb-4">목표 설정</h2>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="목표 금액을 입력하세요"
          className="border p-2 mb-4 w-full"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-300 rounded"
          >
            취소
          </button>
          <button
            onClick={() => {
              onSave(Number(goal));
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

const MainPage: React.FC = () => {
  const [isAssetLinked, setIsAssetLinked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [isGoalSet, setIsGoalSet] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const { username, userId } = useAuthStore();
  const { data: dashBoardInfo } = useDashBoardInfo(String(userId));
  const navigate = useNavigate();

  const petCode = dashBoardInfo?.petCode || "001";
  const petImageUrl = getPetImageUrl(petCode);

  useEffect(() => {
    initializeFirebaseMessaging(1);
    const storedAssetLinkStatus = localStorage.getItem("assetLinked");
    const storedGoalStatus = localStorage.getItem("goalSet");
    if (storedAssetLinkStatus === "true") {
      setIsAssetLinked(true);
    } else if (storedAssetLinkStatus === null) {
      localStorage.setItem("assetLinked", "false");
    }
    if (storedGoalStatus === "true") {
      setIsGoalSet(true);
    }
  }, []);

  const handleAssetLink = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("assetLinked", "true");
      setIsLoading(false);
      setShowSuccessAnimation(true);
      setTimeout(() => setShowFirstText(true), 500);
      setTimeout(() => setShowSecondText(true), 1500);
      setTimeout(() => setShowIcon(true), 2500);
      setTimeout(() => {
        setIsAssetLinked(true);
        setShowSuccessAnimation(false);
      }, 4000);
    } catch (error) {
      console.error("자산 연동 중 오류 발생:", error);
      setIsLoading(false);
    }
  };

  const handleSetGoal = (goal: number) => {
    console.log("Goal set:", goal);
    setIsGoalSet(true);
    localStorage.setItem("goalSet", "true");
  };

  if (showSuccessAnimation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <p
            className={`text-xl font-black mb-4 transition-all duration-1000 ease-out transform ${
              showFirstText
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            자산 연동이
          </p>
          <p
            className={`text-xl font-black mb-12 transition-all duration-1000 ease-out transform ${
              showSecondText
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            완료되었습니다.
          </p>
          <img
            src={UnlockIcon}
            alt="성공 아이콘"
            className={`w-32 h-32 mx-auto transition-all duration-1000 ease-out transform ${
              showIcon
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{ height: `${dvh * 10}px` }}>
          <TextHeader title={`${username} 님`} />
        </header>
        <main
          className="mx-auto"
          style={{ height: `${dvh * 80}px`, width: `${dvw * 90}px` }}
        >
          {isAssetLinked ? (
            <>
              <GoalSettingSection
                isGoalSet={isGoalSet}
                onSetGoal={() => setIsModalOpen(true)}
                goalBalance={dashBoardInfo.goalBalance}
                totalAsset={dashBoardInfo.totalAsset}
                dvh={dvh}
              />
              <div
                className="border-black border-x-4 rounded-lg"
                style={{ height: "35%" }}
              >
                <div
                  className="bg-cover bg-bottom h-full w-full relative"
                  style={{
                    backgroundImage:
                      "url('/backgrounds/pet-idle-background.png')",
                  }}
                >
                  <div className="absolute bottom-4 left-7 p-2 w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32">
                    <PetSprite imageUrl={petImageUrl} isUnlocked={true} />
                    <RandomPetSpeech x={dvw * 15} y={0} />
                  </div>
                </div>
              </div>
              <div
                className="border-black border-4 rounded-lg py-2 px-2"
                style={{ height: "38%" }}
              >
                <div className="flex justify-between items-center pb-2">
                  <p className="text-lg">이번달 지출내역</p>
                  <Link to="/spending" className="flex items-center">
                    <p style={{ color: "#F55322" }}>
                      {dashBoardInfo.monthTotalSpending.toLocaleString(
                        undefined,
                        {
                          maximumFractionDigits: 0,
                        }
                      )}
                      원
                    </p>
                    <Icon path={mdiChevronRight} size={1} color="#F55322" />
                  </Link>
                </div>
                <MonthlyDoughnutChart />
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <p className="text-xl mb-2">자산을 연동하고</p>
              <div>
                <span className="text-xl font-galmuri-11-bold">FFING</span>
                <span className="text-xl">을 만나보세요!</span>
              </div>
              <img src={LockIcon} className="w-32 h-32 my-10" alt="Lock Icon" />
              <button
                onClick={handleAssetLink}
                disabled={isLoading}
                className="py-3 px-6 bg-[#CECECE] text-white rounded-md transition duration-300 font-galmuri-11-bold flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    연동 중...
                  </>
                ) : (
                  "자산 연동하기"
                )}
              </button>
            </div>
          )}
        </main>
        <footer style={{ height: `${dvh * 10}px` }}>
          <NavBar />
        </footer>
      </div>
      <GoalSettingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSetGoal}
      />
    </div>
  );
};

export default MainPage;
