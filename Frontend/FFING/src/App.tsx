import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamePage from './pages/GamePage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';
import AttackSelection from '../src/components/Game/AttackSelection'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<MainPage />} />
        {/* 게임 페이지 */}
        <Route path="/game" element={<GamePage />} />
        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
        {/* 이규석 테스트 */}
        <Route path="/test" element={<AttackSelection />} />
      </Routes>
    </Router>
  );
};

export default App;
