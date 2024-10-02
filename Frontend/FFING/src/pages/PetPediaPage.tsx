import React, { useState } from "react";
// import GameBar from "../components/Game/GameBar";
import NavBar from "../components/Common/Navbar";
import Header from "../components/Common/LinkHeader";
import RecordSection from "../components/Game/RecordSection";
import PetPediaSection from "../components/Game/PetPediaSection";
import useViewportStore from "../store/useViewportStore";  // store import

// PetPediaPage 메인 컴포넌트
const PetPediaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("record");
  // zustand에서 dvw 값을 가져옴
  const dvw = useViewportStore((state) => state.dvw); 

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 게임 상단 header */}
        <header>
          <Header contentName="도감" contentRoute="/game"/>
        </header>

        {/* 기록과 도감 영역을 선택하는 요소 */}
        <nav className="flex justify-around py-2 sticky top-0 z-1 bg-[#FFFFFF]">
          {/* 기록 탭 */}
          <button
            className={`rounded-full px-6 py-3 ${
              activeTab === "record" ? "bg-[#5253F0] text-white" : "bg-[#D9D9D9] text-black"
            }`}
            onClick={() => setActiveTab("record")}
            style={{
              width: `${30 * dvw}px`,  // dvw를 활용한 버튼 너비 설정
            }}
          >
            기록
          </button>

          {/* 도감 탭 */}
          <button
            className={`rounded-full px-6 py-3 ${
              activeTab === "pedia" ? "bg-[#5253F0] text-white" : "bg-[#D9D9D9] text-black"
            }`}
            onClick={() => setActiveTab("pedia")}
            style={{
              width: `${30 * dvw}px`,  // dvw를 활용한 버튼 너비 설정
            }}
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
