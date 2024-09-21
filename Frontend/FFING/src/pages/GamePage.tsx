import React from "react";
import GameBar from "../components/Game/GameBar";
import NavBar from "../components/Common/Navbar";
import PetIdle from "../components/Game/PetIdle";
import PetStatusChart from "../components/Game/PetStatusChart";

const GamePage: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header>
          <GameBar />
        </header>
        <div>
          <PetIdle />
        </div>
        <div>
          <PetStatusChart />
        </div>

        {/* 버튼 영역 */}
        <div className="flex rounded-lg overflow-hidden w-full max-w-screen-md mx-auto mt-6 h-16 text-2xl">
          {/* 게임 시작 버튼 */}
          <button
            className="flex-grow-[7] bg-[#FFD874] text-black py-2 rounded-l-lg font-galmuri-11-bold text-2xl"
          // onClick={() => { /* 게임 시작 라우팅 */ }}
          >
            게임 시작
          </button>

          {/* 랭킹 버튼 */}
          <button
            className="flex-grow-[3] bg-[#FFA1A1] text-black py-2 rounded-r-lg font-galmuri-11-bold"
          // onClick={() => { /* 랭킹 라우팅 */ }}
          >
            랭킹
          </button>
        </div>

        <footer>
          <NavBar />
        </footer>
      </div>

    </div>
  );
};

export default GamePage;
