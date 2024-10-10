import React, { useState, useEffect } from "react";
import TextHeader from "../components/Common/TextHeader";
import NavBar from "../components/Common/Navbar";
import PetIdle from "../components/Game/PetIdle";
import PetStatusChart from "../components/Game/PetStatusChart";
import RandomMatching from "./RandomMatching";
import DirectMatching from "./DirectMatching";
import useViewportStore from "../store/useViewportStore";
import { useAuthStore } from "../store/authStore";

const GamePage: React.FC = () => {
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const { userId, nickname } = useAuthStore();

  // 랜덤 매칭 모달 열기
  const handleOpenRandomModal = () => {
    setIsRandomModalOpen(true);
  };

  // 랜덤 매칭 모달 닫기
  const handleCloseRandomModal = () => {
    setIsRandomModalOpen(false);
  };

  // 초대 매칭 모달 열기
  const handleOpenInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  // 초대 매칭 모달 닫기
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{ height: `${dvh * 10}px` }}>
          <TextHeader title={nickname} />
        </header>
        <main
          className="mx-auto"
          style={{ height: `${dvh * 80}px`, width: `${dvw * 90}px` }}
        >
          {/* 내 펫이 인사를 하는 컴포넌트 */}
          <div style={{ height: "40%" }}>
            <PetIdle />
          </div>
          {/* 내 펫의 스탯 차트 */}
          <div className="my-4" style={{ height: "40%" }}>
            <PetStatusChart />
          </div>
          {/* 매칭 시작과 초대 버튼 */}
          <div className="flex rounded-lg overflow-hidden gap-2 w-full max-w-screen-md mx-auto h-16 text-2xl font-galmuri-11-bold">
            <button
              onClick={handleOpenRandomModal}
              className="flex-grow bg-[#FFD874] text-black py-2 rounded-lg font-bold"
            >
              랜덤 매칭
            </button>
            <button
              onClick={handleOpenInviteModal}
              className="flex-grow bg-[#FFA1A1] text-black py-2 rounded-lg font-bold"
            >
              초대 매칭
            </button>
          </div>
          {/* 랜덤 매칭 모달 */}
          {isRandomModalOpen && (
            <RandomMatching
              isOpen={isRandomModalOpen}
              onClose={handleCloseRandomModal}
              myUserId={userId}
            />
          )}
          {/* 초대 매칭 모달 */}
          {isInviteModalOpen && (
            <DirectMatching
              isOpen={isInviteModalOpen}
              onClose={handleCloseInviteModal}
              myUserId={"1"}
            />
          )}
        </main>
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default GamePage;
