import React from "react";
import GameBar from "../components/Game/GameBar";
import NavBar from "../components/Common/Navbar";

const RankingPage: React.FC = () => {
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="w-screen h-screen">
          {/* 읽지 않은 알람 표시와 링크를 제공하는 header */}
          <header>
            <GameBar />
          </header>
          {/* 이번 달 랭킹을 보여주는 컴포넌트 */}
          <div>
          </div>
          {/* 경로 이동을 제공하는 footer */}
          <footer>
            <NavBar />
          </footer>
        </div>
      </div>
    </>
  );
};

export default RankingPage;