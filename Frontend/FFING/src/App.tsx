import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import GamePage from './pages/GamePage';
import BattlePage from './pages/BattlePage';
import RankingPage from './pages/RankingPage';
// import MatchingPage from './pages/MatchingPage';
import PetPediaPage from './pages/PetPediaPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';
import SpendingCategoryPage from './pages/SpendingCategoryPage';
import SpendingMonthlyPage from './pages/SpendingMonthlyPage';
import SpendingMonthlyAnalysisPage from './pages/SpendingMonthlyAnalysisPage';
import SpendingWeeklyPage from './pages/SpendingWeeklyPage'
import AssetMainPage from './pages/AssetMainPage';
import DepositSavingsPage from './pages/DepositSavingsPage';
import DepositSavingDetailPage from './pages/DepositSavingDetailPage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  // const navigate = useNavigate();

  // 로그인 성공시
  // const handleLoginSuccess = () => {
  //   // 리다이렉트
  //   navigate('/');
  // };

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
        <Route path="/spending/monthly/analysis" element={<SpendingMonthlyAnalysisPage />} />
        {/* 주간 지출 페이지 */}
        <Route path="/spending/monthly/weekly" element={<SpendingWeeklyPage />} />
        {/* 자산 메인 페이지 */}
        <Route path="/asset" element={<AssetMainPage />} />
        {/* 예금 적금 페이지 */}
        <Route path="/asset/product" element={<DepositSavingsPage />} />
        {/* 예금 적금 페이지 */}
        <Route path="/asset/product/detail" element={<DepositSavingDetailPage />} />
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
        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
