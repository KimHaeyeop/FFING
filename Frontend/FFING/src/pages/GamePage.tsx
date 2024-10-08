import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TextHeader from "../components/Common/TextHeader";
import NavBar from "../components/Common/Navbar";
import PetIdle from "../components/Game/PetIdle";
import PetStatusChart from "../components/Game/PetStatusChart";
import MatchingPageModal from "./MatchingPage";
import { getPets } from "../api/PetPediaApi";
import useViewportStore from "../store/useViewportStore";

const GamePage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // 펫 능력치를 가져오는 함수
  const fetchData = async (userId: string) => {
    try {
      const responsePetStats = getPets(userId)
      console.log(responsePetStats);
    } catch (error) {
      console.error("Error fetching certain spending data:", error);
    }
  };

  useEffect(() => {
    fetchData('1');
  }, []);

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
        <header style={{ height: `${dvh * 10}px` }}>
          <TextHeader title="이규석 님"/>
        </header>
        <main className='mx-auto' style={{ height: `${dvh * 80}px`, width: `${dvw * 90}px` }}>
          {/* 내 펫이 인사를 하는 컴포넌트*/}
          <div style={{ height: "40%" }}>
            <PetIdle />
          </div>
          {/* 내 펫의 스탯이 보이는 차트 컴포넌트 */}
          <div style={{ height: "40%" }}>
            <PetStatusChart />
          </div>
          {/* 버튼 영역 */}
          <div className="flex rounded-lg overflow-hidden w-full max-w-screen-md mx-auto mt-6 h-16 text-2xl" style={{ height: "10%" }}>
            {/* 게임 시작 버튼 */}
            <button onClick={handleOpenModal} className="flex-grow-[7] bg-[#FFD874] text-black py-2 rounded-l-lg font-galmuri-11-bold text-2xl">매칭 시작</button>
            {/* <Link to="/game/battle" className="flex-grow-[7] bg-[#FFD874] text-black py-2 rounded-l-lg font-galmuri-11-bold text-2xl">게임으로 바로 이동(test)</Link> */}
          </div>
          {isModalOpen && (
            <MatchingPageModal isOpen={isModalOpen} onClose={handleCloseModal} myUserId={"1"} opponentUserId={"1"} />
          )}
        </main>
        {/* 경로 이동을 제공하는 footer */}
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default GamePage;
