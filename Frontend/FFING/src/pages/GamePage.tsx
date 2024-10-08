import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextHeader from "../components/Common/TextHeader";
import NavBar from "../components/Common/Navbar";
import PetIdle from "../components/Game/PetIdle";
import PetStatusChart from "../components/Game/PetStatusChart";
import MatchingPageModal from "./MatchingPage";

const GamePage: React.FC = () => {
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);


  // 랜덤 모달 열기
  const handleOpenRandomModal = () => {
    setIsRandomModalOpen(true);
  }

  // 랜덤 모달 닫기
  const handleCloseRandomModal = () => {
    setIsRandomModalOpen(false);
  }

  // 초대 모달 열기
  const handleOpenInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  // 초대 모달 닫기
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  // 상대방 닉네임 입력 후 초대 매칭 시작
  const handleStartInviteMatch = (nickname: string) => {
    setIsInviteModalOpen(false);
    setIsRandomModalOpen(true);
  }

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
          <button onClick={handleOpenModal} className="flex-grow-[7] bg-[#FFD874] text-black py-2 rounded-l-lg font-galmuri-11-bold text-2xl">랜덤</button>
          {/* <Link to="/game/battle" className="flex-grow-[7] bg-[#FFD874] text-black py-2 rounded-l-lg font-galmuri-11-bold text-2xl">게임으로 바로 이동(test)</Link> */}
          <button onClick={handleOpenModal} className="flex-grow-[7] bg-[#FFD874] text-black py-2 rounded-l-lg font-galmuri-11-bold text-2xl">초대</button>
        </div>
        {isModalOpen && (
          <MatchingPageModal isOpen={isModalOpen} onClose={handleCloseModal} myUserId={"1"} opponentUserId={"1"} />
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
