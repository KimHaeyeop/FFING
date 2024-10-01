import React from "react";
import TextHeader from '../components/Common/TextHeader'
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";

const MainPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{height: `${dvh * 5}px`}}>
          {/* 사용자의 정보와 알람 */}
          <TextHeader title="이규석 님"/> 
        </header>
        <main style={{height: `${dvh * 80}px`}}>
          {/* 자산 목표 달성 관련 */}
          <div style={{height: '20%'}}>
            목표 달성까지
          </div>
          {/* 게임 화면 관련 */}
          <div style={{height: '40%'}}>
            펫 화면
          </div>
          {/* 지출 내역 관련 */}
          <div style={{height: '40%'}}>
            이번달 지출 내역
          </div>
        </main>
        <footer style={{height: `${dvh * 15}px`}}>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default MainPage;