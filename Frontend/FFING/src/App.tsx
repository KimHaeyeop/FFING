import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamePage from './pages/GamePage';
import BattlePage from './pages/BattlePage';
import RankingPage from './pages/RankingPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/main" element={<MainPage />} />
        {/* 게임 페이지(원래 /game) */}
        <Route path="/" element={<GamePage />} />
        {/* 배틀 페이지 (원래 /game/battle)*/}
        <Route path="/battle" element={<BattlePage />} />
        {/* 랭킹 페이지 (원래 /game/ranking)*/}
        <Route path="/ranking" element={<RankingPage />} />
        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router> 
  );
};

export default App;
