import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamePage from "./pages/GamePage";
import BattlePage from "./pages/BattlePage";
import RankingPage from "./pages/RankingPage";
// import MatchingPage from './pages/MatchingPage';
import PetPediaPage from "./pages/PetPediaPage";
import MainPage from "./pages/MainPage";
import NotFoundPage from "./pages/NotFoundPage";
import SpendingCategoryPage from "./pages/SpendingCategoryPage";
import SpendingMonthlyPage from "./pages/SpendingMonthlyPage";
import SpendingAnalysisPage from "./pages/SpendingAnalysisPage";
import SpendingWeeklyPage from "./pages/SpendingWeeklyPage";
import AlarmPage from "./pages/AlarmPage";

import { requestPermissionAndGetToken } from "./service/firebase";

import AssetMainPage from "./pages/AssetMainPage";
import DepositSavingsPage from "./pages/DepositSavingsPage";
import DepositSavingDetailPage from "./pages/DepositSavingDetailPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  useEffect(() => {
    // const initializeFCM = async () => {
    //   try {
    //     // 여기서 사용자 ID를 가져오는 로직이 필요합니다.
    //     // 예를 들어, 로컬 스토리지나 상태 관리 라이브러리에서 가져올 수 있습니다.
    //     const userId = 1; // 이 함수는 실제로 구현해야 합니다.
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
  }, []);

  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        {/* 메인 페이지 */}
        <Route path="/" element={<MainPage />} />
        {/* 자산 페이지 */}
        {/* <Route path="/assets" element={<ApiTest />} /> */}
        {/* 지출 페이지 */}
        <Route path="/spending" element={<SpendingCategoryPage />} />
        {/* 월간 지출 페이지 */}
        <Route path="/spending/monthly" element={<SpendingMonthlyPage />} />
        {/* 월간 지출 분석 페이지 */}
        <Route
          path="/spending/monthly/analysis"
          element={<SpendingAnalysisPage />}
        />
        {/* 주간 지출 페이지 */}
        <Route
          path="/spending/monthly/weekly"
          element={<SpendingWeeklyPage />}
        />
        {/* 자산 메인 페이지 */}
        <Route path="/asset" element={<AssetMainPage />} />
        {/* 예금 적금 페이지 */}
        <Route path="/asset/product" element={<DepositSavingsPage />} />
        {/* 예금 적금 페이지 */}
        <Route
          path="/asset/product/detail"
          element={<DepositSavingDetailPage />}
        />
        {/* 게임 페이지 */}
        <Route path="/game" element={<GamePage />} />
        {/* 매칭 잡는 페이지 */}
        {/* <Route path="/game/matching" element={<MatchingPageModal />} /> */}
        {/* 배틀 페이지 */}
        <Route path="/game/battle" element={<BattlePage />} />
        {/* 랭킹 페이지 */}
        <Route path="/game/ranking" element={<RankingPage />} />
        {/* 도감 페이지 */}
        <Route path="/petpedia" element={<PetPediaPage />} />
        {/* 알림 */}
        <Route path="/alarm" element={<AlarmPage />} />
        {/* Admin 페이지 */}
        <Route path="/admin" element={<AdminPage />} />
        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
