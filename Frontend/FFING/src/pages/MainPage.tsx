import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import usePetInfoStore from "../store/usePetInfoStore";

const MainPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const { username, userId } = useAuthStore();
  const { data: dashBoardInfo, isLoading } = useDashBoardInfo(String(userId)); // 로딩 상태로 안정성 확보

  const petCode = dashBoardInfo?.petCode || "001"; // 메타데이터에서 petCode 가져오기 (없을 경우 '001' 기본값 사용)
  // petCode와 일치하는 petCode를 가진 pet 객체를 가져옴
  const petInfo = usePetInfoStore((state) =>
    state.petSpriteMetaData.find((pet) => pet.petCode === petCode)
  );

  useEffect(() => {

    // const initializeFCM = async () => {
    //   try {
    //     // 여기서 사용자 ID를 가져오는 로직이 필요
    //     const userId = 1;
    //     if (userId) {
    //       await requestPermissionAndGetToken(1);
    //     } else {
    //       console.log(
    //         "사용자가 로그인하지 않았습니다. FCM 토큰을 요청하지 않습니다."
    //       );
    //     }
    //   } catch (error) {
    //     console.error("FCM 초기화 중 오류 발생:", error);
    //   }
    // };
    // initializeFCM();

    initializeFirebaseMessaging(1);
  }, []);

  // 데이터를 받아오는 중일 때 로딩 화면을 보여줌
  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 보여줄 UI
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{ height: `${dvh * 10}px` }}>
          {/* 사용자의 정보와 알람 API 연동 필요*/}
          <TextHeader title={`${username} 님`} />
        </header>
        <main
          className="mx-auto"
          style={{ height: `${dvh * 80}px`, width: `${dvw * 90}px` }}
        >
          {/* 자산 목표 달성 관련 */}
          <div className="border-black border-4 rounded-lg" style={{ height: "25%" }}>
            {/* 자산 부분 링크와 소제목 */}
            <div className="flex justify-between p-2">
              <p className="text-lg mb-3">목표 달성까지</p>
              <Link to="/asset">
                <Icon path={mdiChevronRight} size={1} style={{ color: "#F55322" }} />
              </Link>
            </div>
            {/* 현재 보유액과 목표액을 보여주는 바 그래프 */}
            <div className="flex justify-center">
              <HorizontalBarChart assetDiff={dashBoardInfo.goalBalance - dashBoardInfo.totalAsset} />
            </div>
          </div>
          {/* 게임 화면 관련 */}
          <div className="border-black border-x-4 rounded-lg" style={{ height: "35%" }}>
            {/* 배경 화면 넣기 */}
            <div
              className="bg-cover bg-bottom h-full w-full relative"
              style={{
                backgroundImage: "url('/backgrounds/pet-idle-background.png')",
              }}
            >
              {/* 펫 sprite sheet 넣기 */}
              <div className="absolute bottom-4 left-7 p-2 w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32">
                {petInfo ? (
                  <PetSprite imageUrl={petInfo.imageUrl} isUnlocked={true} />
                ) : (
                  <PetSprite imageUrl="/default-pet.png" isUnlocked={true} /> // 기본 이미지 사용
                )}
                <RandomPetSpeech x={dvw * 15} y={0} />
              </div>
            </div>
          </div>
          {/* 지출 내역 관련 */}
          <div className="border-black border-4 rounded-lg py-2 px-2" style={{ height: "38%" }}>
            <div className="flex justify-between items-center pb-2">
              <p className="text-lg">이번달 지출내역</p>
              <Link to="/spending" className="flex items-center">
                {/* 사용 금액 API 가져오기 */}
                <p style={{ color: "#F55322" }}>
                  {dashBoardInfo?.monthTotalSpending.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  }) || 0}
                  원
                </p>
                <Icon path={mdiChevronRight} size={1} color="#F55322" />
              </Link>
            </div>
            {/* 이번 달 지출 내역을 나타내는 차트 */}
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
