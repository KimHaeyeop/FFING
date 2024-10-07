import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// 메인, 기타
import MainPage from './pages/MainPage';  // 서비스 메인 페이지
import NotFoundPage from './pages/NotFoundPage';  // 404 페이지
// 게임
import GamePage from './pages/GamePage';  // 게임 메인 페이지
// import MatchingPage from './pages/MatchingPage';
import BattlePage from './pages/BattlePage';  // 전투 수행 페이지
// 도감, 랭킹
import RankingPage from './pages/RankingPage';  // 랭킹 페이지(아직 구현 x)
import PetPediaPage from './pages/PetPediaPage';  // 도감 페이지
// 지출
import SpendingCategoryPage from './pages/SpendingCategoryPage';  // 항목 별 지출 페이지
import SpendingMonthlyPage from './pages/SpendingMonthlyPage';  // 월간 지출 페이지
import SpendingAnalysisPage from './pages/SpendingAnalysisPage';  // 지출 분석 페이지
import SpendingWeeklyPage from './pages/SpendingWeeklyPage' // 주차 별 지출 페이지
// 자산
import AssetMainPage from './pages/AssetMainPage';  // 자산 메인 페이지
import DepositSavingPage from './pages/DepositSavingsPage'; // 예적금 목록 페이지
import DepositSavingDetailPage from './pages/DepositSavingDetailPage';  // 예적금 상세 페이지
import StockPage from './pages/StockPage' // 유가증권 목록 페이지

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 메인, 기타 */}
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* 소비 */}
        <Route path="/spending" element={<SpendingCategoryPage />} />
        <Route path="/spending/monthly" element={<SpendingMonthlyPage />} />
        <Route path="/spending/monthly/analysis" element={<SpendingAnalysisPage />} />
        <Route path="/spending/monthly/weekly" element={<SpendingWeeklyPage />} />
        {/* 자산 */}
        <Route path="/asset" element={<AssetMainPage />} />
        <Route path="/asset/product" element={<DepositSavingPage />} />
        <Route path="/asset/product/detail" element={<DepositSavingDetailPage />} />
        <Route path="/asset/stock" element={<StockPage />} />
        {/* 게임 */}
        <Route path="/game" element={<GamePage />} />
        <Route path="/game/battle" element={<BattlePage />} />
        {/* <Route path="/game/matching" element={<MatchingPageModal />} /> */}
        <Route path="/game/ranking" element={<RankingPage />} />
        {/* 도감 */}
        <Route path="/petpedia" element={<PetPediaPage />} />
      </Routes>
    </Router> 
  );
};

export default App;
