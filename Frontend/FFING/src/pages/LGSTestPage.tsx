import React from "react";
import NavBar from "../components/Common/Navbar";
import AttackSelection from '../components/Game/AttackSelection'
import DisplayWinner from "../components/Game/DisplayWinner";
import PetIdle from "../components/Game/PetIdle";

const MainPage: React.FC = () => {
  return (
    <>
      <div>
        <PetIdle />
      </div>
      <div>
        <AttackSelection />
      </div>
      <div>
        <DisplayWinner />
      </div>
      <footer>
        <NavBar />
      </footer>
    </>
  );
};

export default MainPage;