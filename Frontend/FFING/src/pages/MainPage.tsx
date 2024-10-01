import React from "react";
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronRight } from '@mdi/js';
import TextHeader from '../components/Common/TextHeader'
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import SpendingMonthlyChart from "../components/Spending/SpendingMonthlyChart";

const MainPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{height: `${dvh * 10}px`}}>
          {/* 사용자의 정보와 알람 */}
          <TextHeader title="이규석 님"/> 
        </header>
        <main className='mx-auto'style={{height: `${dvh * 75}px`, width: `${dvw * 90}px`}}>
          {/* 자산 목표 달성 관련 */}
          <div className="border-black border-4 rounded-lg" style={{height: '20%'}}>
            목표 달성까지
          </div>
          {/* 게임 화면 관련 */}
          <div className="border-black border-x-4 rounded-lg" style={{height: '40%'}}>
            펫 화면
          </div>
          {/* 지출 내역 관련 */}
          <div className="border-black border-4 rounded-lg" style={{height: '40%'}}>
            <div className='flex justify-between items-center m-2'>
              <p className="text-xl">이번달 지출내역</p>
              <Link to='/spending' className='flex items-center'>
                <p>1,221,123원</p>
                <Icon path={mdiChevronRight} size={1} color='#F55322'/>
              </Link>
            </div>
            <SpendingMonthlyChart />
          </div>
        </main>
        <footer style={{height: `${dvh * 10}px`}}>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default MainPage;