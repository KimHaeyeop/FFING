import React from "react";
import { Link } from "react-router-dom";
import GameBar from "../components/Game/GameBar";
import NavBar from "../components/Common/Navbar";
import PetIdle from "../components/Game/PetIdle";
import PetStatusChart from "../components/Game/PetStatusChart";

const GamePage: React.FC = () => {
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
          <Link to="/find">게임시작</Link>
          <Link to="/battle">게임으로 바로 이동(test)</Link>
          {/* <button
            className="flex-grow-[7] bg-[#FFD874] text-black py-2 rounded-l-lg font-galmuri-11-bold text-2xl"
            onClick={() => { navigate('/battle') }} 
          >
            게임 시작
          </button> */}
          {/* 랭킹 버튼 */}
          <Link to="/ranking">랭킹</Link>
          {/* <button
            className="flex-grow-[3] bg-[#FFA1A1] text-black py-2 rounded-r-lg font-galmuri-11-bold"
          onClick={() => { navigate('/ranking')}} 
          >
            랭킹
          </button> */}
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
