import React from "react";
import { useNavigate } from 'react-router-dom';
import GameBar from "../components/Game/GameBar";
import NavBar from "../components/Common/Navbar";
import PetIdle from "../components/Game/PetIdle";
import PetStatusChart from "../components/Game/PetStatusChart";

const GamePage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 게임 상단의 petfight와 알람을 표시하는 header */}
        <header>
          <GameBar />
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
          <button
            className="flex-grow-[7] bg-[#FFD874] text-black py-2 rounded-l-lg font-galmuri-11-bold text-2xl"
          onClick={() => { navigate('/battle') }} // 큐잡는 페이지로 이동 필요
          >
            게임 시작
          </button>
          {/* 랭킹 버튼 */}
          <button
            className="flex-grow-[3] bg-[#FFA1A1] text-black py-2 rounded-r-lg font-galmuri-11-bold"
          onClick={() => { console.log('랭킹 이동 클릭됨') }} // 랭킹 라우팅 추가 필요
          >
            랭킹
          </button>
        </div>
        {/* 경로 이동을 제공하는 footer */}
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default GamePage;
