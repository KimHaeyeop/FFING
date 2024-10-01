import React from "react";
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronRight } from '@mdi/js';
import TextHeader from '../components/Common/TextHeader'
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import SpendingMonthlyChart from "../components/Spending/MonthlyChart";

const MainPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{height: `${dvh * 10}px`}}>
          {/* 사용자의 정보와 알람 API 연동 필요*/}
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
            <div className='flex justify-between items-center mt-2 mx-2'>
              <p className="text-xl">이번달 지출내역</p>
              <Link to='/spending' className='flex items-center'>
                {/* 사용 금액 API 가져오기 */}
                <p style={{color: '#F55322'}}>9,123,456원</p>
                <Icon path={mdiChevronRight} size={1} color='#F55322'/>
              </Link>
            </div>
            {/* 이번 달 지출 내역을 나타내는 차트 API 연동 필요*/}
            <SpendingMonthlyChart chartData={[20, 5, 15, 25, 20, 15]}/>
          </div>
        </main>
        {/* 페이지 이동을 위한 footer */}
        <footer style={{height: `${dvh * 10}px`}}>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default MainPage;