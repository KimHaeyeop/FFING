import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamePage from './pages/GamePage';
import BattlePage from './pages/BattlePage';
import RankingPage from './pages/RankingPage';
import MatchingPage from './pages/MatchingPage';
import PetPediaPage from './pages/PetPediaPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<MainPage />} />
        {/* 게임 페이지(원래 /game) */}
        <Route path="/game" element={<GamePage />} />
        {/* 매칭 잡는 페이지 */}
        <Route path="/game/matching" element={<MatchingPage />} />
        {/* 배틀 페이지 */}
        <Route path="/game/battle" element={<BattlePage />} />
        {/* 랭킹 페이지 */}
        <Route path="/game/ranking" element={<RankingPage />} />
        {/* 도감 페이지 */}
        <Route path="/game/petpedia" element={<PetPediaPage />} />
        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router> 
  );
};

export default App;
