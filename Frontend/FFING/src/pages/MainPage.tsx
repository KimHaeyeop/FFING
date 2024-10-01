import React from "react";
import Header from '../components/Common/Header'
import NavBar from "../components/Common/Navbar";

const MainPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header>
          {/* route 실험 */}
          <Header contentName="지출" contentRoute="/game"/> 
        </header>
        <div>
          메인페이지
        </div>
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default MainPage;