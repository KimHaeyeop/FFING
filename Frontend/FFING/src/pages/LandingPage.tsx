import React, { useState, useEffect } from 'react';
import useViewportStore from '../store/useViewportStore'; // 화면 관리 컴포넌트
import PetDance from '../components/Game/PetDance'; // 펫들이 춤을 추고 있는 phaser 컴포넌트
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const LandingPage: React.FC = () => {

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <PetDance />
      </div>
    </div>
  );
};

export default LandingPage;
