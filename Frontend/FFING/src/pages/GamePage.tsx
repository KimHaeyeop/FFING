import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextHeader from "../components/Common/TextHeader";
import NavBar from "../components/Common/Navbar";
import PetIdle from "../components/Game/PetIdle";
import PetStatusChart from "../components/Game/PetStatusChart";
import MatchingPageModal from "./MatchingPage";

const GamePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 게임 상단에 사용자 이름?과 알람을 표시하는 header */}
        <header>
          <TextHeader title="이규석 님"/>
        </header>
        {/* 내 펫이 인사를 하는 컴포넌트*/}
        <div>
          <PetIdle />
        </div>
        {/* 내 펫의 스탯이 보이는 차트 컴포넌트 */}
        <div>
          <PetStatusChart />
        </div>
        {/* 버튼 영역 */}
        <div className="flex rounded-lg overflow-hidden w-full max-w-screen-md mx-auto mt-6 h-16 text-2xl">
          {/* 게임 시작 버튼 */}
          <button onClick={handleOpenModal} className="flex-grow-[7] bg-[#FFD874] text-black py-2 rounded-l-lg font-galmuri-11-bold text-2xl">모달</button>
          {/* <Link to="/game/battle" className="flex-grow-[7] bg-[#FFD874] text-black py-2 rounded-l-lg font-galmuri-11-bold text-2xl">게임으로 바로 이동(test)</Link> */}
          {/* 랭킹 버튼 */}
          <Link to="/game/petpedia" className="flex-grow-[3] bg-[#FFA1A1] text-black py-2 rounded-r-lg font-galmuri-11-bold">도감</Link>
        </div>
        {isModalOpen && (
          <MatchingPageModal isOpen={isModalOpen} onClose={handleCloseModal} />
        )}
        {/* 경로 이동을 제공하는 footer */}
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default GamePage;
