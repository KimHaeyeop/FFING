import React from "react";
import NavBar from "../components/Common/Navbar";
import PetIdle from "../components/Game/PetIdle";
import PetStatusChart from "../components/Game/PetStatusChart";

const GamePage: React.FC = () => {
  return (
    <>
      <div>
        게임페이지
      </div>
      <div>
        <PetIdle />
      </div>
      <div>
        <PetStatusChart />
      </div>
      <div>
        <button> 게임 시작 | 랭킹 </button>
      </div>
      <footer>
        <NavBar />
      </footer>
    </>
  );
};

export default GamePage;