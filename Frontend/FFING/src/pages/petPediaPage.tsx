import React, { useState } from "react";
import GameBar from "../components/Game/GameBar";
import NavBar from "../components/Common/Navbar";
import TabSelection from "../components/Game/Tabselection";
import RecordSection from "../components/Game/RecordSection";
import PetPediaSection from "../components/Game/PetPediasection";

// PetPediaPage 메인 컴포넌트
const PetPediaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("record");

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 게임 상단 header */}
        <header>
          <GameBar />
        </header>

        {/* 기록과 도감 영역을 선택하는 컴포넌트 */}
        {/* 여기로 옮기기 */}
        <TabSelection activeTab={activeTab} setActiveTab={setActiveTab} />  

        {/* 기록 영역 또는 도감 영역을 조건부 렌더링 */}
        <main>
          {activeTab === "record" ? <RecordSection /> : <PetPediaSection />}
        </main>

        {/* 페이지 전환을 위한 footer */}
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default PetPediaPage;
