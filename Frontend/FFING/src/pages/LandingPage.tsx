import React, { useState, useEffect } from 'react';
import useViewportStore from '../store/useViewportStore'; // 화면 관리 컴포넌트
import PetDance from '../components/Game/PetDance'; // 펫들이 춤을 추고 있는 phaser 컴포넌트

const LandingPage: React.FC = () => {
  const { dvw, dvh } = useViewportStore(); // Zustand에서 동적 뷰포트 크기 가져오기

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <div>
          <PetDance />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
