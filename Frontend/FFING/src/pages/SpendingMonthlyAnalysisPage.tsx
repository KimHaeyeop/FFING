import React from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronLeft } from '@mdi/js';
import LinkHeader from '../components/Common/LinkHeader'
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";

const SpendingCategoryPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 월간 지출 내역으로 되돌아가는 링크와 알람 header */}
        <header style={{height: `${dvh * 10}px`}}>
          <LinkHeader contentName="지출" contentRoute="/spending/monthly"/> 
        </header>
        <main className='mx-auto'style={{height: `${dvh * 75}px`, width: `${dvw * 90}px`}}>
        </main>
        {/* 페이지 이동을 위한 footer */}
        <footer style={{height: `${dvh * 10}px`}}>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default SpendingCategoryPage;