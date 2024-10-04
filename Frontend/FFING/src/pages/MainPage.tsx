import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronRight } from '@mdi/js';
import TextHeader from '../components/Common/TextHeader'
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import MonthlyDoughnutChart from "../components/Spending/MonthlyDoughnutChart";
import PetSprite from "../components/Game/PetSprite";
import { get1, get2, get3, get4, get5, get6, get7 } from '../api/assetApi'
import SpeechBubble from "../components/Common/SpeechBubble";



const MainPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  // 테스트
  const fetchData = async () => {
    try {
      await get3('1');
    } catch (error) {
      console.error('Error fetching certain spending data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{height: `${dvh * 10}px`}}>
          {/* 사용자의 정보와 알람 API 연동 필요*/}
          <TextHeader title="이규석 님"/> 
        </header>
        <main className='mx-auto'style={{height: `${dvh * 80}px`, width: `${dvw * 90}px`}}>
          {/* 자산 목표 달성 관련 */}
          <div className="border-black border-4 rounded-lg" style={{height: '20%'}}>
            목표 달성까지
          </div>
          {/* 게임 화면 관련 */}
          <div className="border-black border-x-4 rounded-lg" style={{height: '40%'}}>
            {/* 배경 화면 넣기 */}
            <div className="bg-cover bg-bottom h-full w-full relative" style={{ backgroundImage: "url('/backgrounds/pet-idle-background.png')" }}>
              {/* 펫 sprite sheet 넣기 */}
              <div className="absolute bottom-8 left-8 p-2 w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32">
                <PetSprite imageUrl="/pets/penguin.png" isUnlocked={true} />
              </div>
              <SpeechBubble text="안녕하세요." x={1} y={1} />
            </div>
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
            <MonthlyDoughnutChart />
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