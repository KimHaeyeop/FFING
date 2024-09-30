import React, { useState } from "react";
import GameBar from "../components/Game/GameBar";
import NavBar from "../components/Common/Navbar";
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
        <nav className="flex justify-center mt-5 space-x-4">
          {/* 기록 탭 */}
          <button
            className={`rounded-full px-6 py-3 ${
              activeTab === "record" ? "bg-[#5253F0] text-white" : "bg-[#D9D9D9] text-black"
            }`}
            onClick={() => setActiveTab("record")}
          >
            기록
          </button>

          {/* 도감 탭 */}
          <button
            className={`rounded-full px-6 py-3 ${
              activeTab === "pedia" ? "bg-[#5253F0] text-white" : "bg-[#D9D9D9] text-black"
            }`}
            onClick={() => setActiveTab("pedia")}
          >
            도감
          </button>
        </nav>

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
