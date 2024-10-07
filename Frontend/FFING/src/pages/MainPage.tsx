import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import TextHeader from "../components/Common/TextHeader";
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import MonthlyDoughnutChart from "../components/Spending/MonthlyDoughnutChart";
import PetSprite from "../components/Game/PetSprite";
import PetSpeechBubble from "../components/Common/PetSpeechBubble";
import HorizontalBarChart from "../components/Asset/HorizontalBarChart";
import { getMonthlyExpense } from '../api/SpendingApi';
import { getTotalAsset } from "../api/AssetApi";

const MainPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const [thisMonthExpense, setThisMonthExpese] = useState(0); // 이번 달 지출액 관리

  // 이번 달 지출액을 가져오는 함수
  const fetchData = async () => {
    try {
      const yyyyMm = new Date()
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "")
        .slice(0, 6);
      const response = await getMonthlyExpense(yyyyMm);
      // const response1 = await getTotalAsset('1');
      // console.log(response1);
      setThisMonthExpese(response.data.result.totalExpense);
    } catch (error) {
      console.error("Error fetching certain spending data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{ height: `${dvh * 10}px` }}>
          {/* 사용자의 정보와 알람 API 연동 필요*/}
          <TextHeader title="이규석 님" />
        </header>
        <main
          className="mx-auto"
          style={{ height: `${dvh * 80}px`, width: `${dvw * 90}px` }}
        >
          {/* 자산 목표 달성 관련 */}
          <div
            className="border-black border-4 rounded-lg"
            style={{ height: "20%" }}
          >
            {/* 자산 부분 링크와 소제목 */}
            <div className="flex justify-between p-2">
              <p>목표 달성까지</p>
              <Link to="/asset">
                <Icon
                  path={mdiChevronRight}
                  size={1}
                  style={{ color: "#F55322" }}
                />
              </Link>
            </div>
            {/* 현재 보유액과 목표액을 보여주는 바 그래프 */}
            <div className="flex justify-center">
              <HorizontalBarChart />
            </div>
          </div>
          {/* 게임 화면 관련 */}
          <div
            className="border-black border-x-4 rounded-lg"
            style={{ height: "40%" }}
          >
            {/* 배경 화면 넣기 */}
            <div
              className="bg-cover bg-bottom h-full w-full relative"
              style={{
                backgroundImage: "url('/backgrounds/pet-idle-background.png')",
              }}
            >
              {/* 펫 sprite sheet 넣기 */}
              <div className="absolute bottom-4 left-4 p-2 w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32">
                <PetSprite imageUrl="/pets/penguin.png" isUnlocked={true} />
                <PetSpeechBubble
                  text="is_not_unfair = [[False] * (V + 1) for _ in range(V + 1)]]! for i in range(N): for j in range(N): print('hi')"
                  x={dvw * 15}
                  y={0}
                />
              </div>
              {/* 게임 화면으로 이동하는 버튼 */}
              <Link
                to="/game"
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white bg-black rounded-lg p-1 m-2"
              >
                Let's Game
              </Link>
            </div>
          </div>
          {/* 지출 내역 관련 */}
          <div
            className="border-black border-4 rounded-lg"
            style={{ height: "40%" }}
          >
            <div className="flex justify-between items-center mt-2 mx-2">
              <p className="text-xl">이번달 지출내역</p>
              <Link to="/spending" className="flex items-center">
                {/* 사용 금액 API 가져오기 */}
                <p style={{ color: "#F55322" }}>
                  {thisMonthExpense.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                  원
                </p>
                <Icon path={mdiChevronRight} size={1} color="#F55322" />
              </Link>
            </div>
            {/* 이번 달 지출 내역을 나타내는 차트 API 연동 필요*/}
            <MonthlyDoughnutChart />
          </div>
        </main>
        {/* 페이지 이동을 위한 footer */}
        <footer style={{ height: `${dvh * 10}px` }}>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default MainPage;