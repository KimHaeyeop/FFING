import React, { useEffect, useState } from "react";
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import LinkHeader from "../components/Common/LinkHeader";



const StockPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  
  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{height: `${dvh * 10}px`}}>
          {/* assetMain으로 이동 */}
          <LinkHeader contentName="주식" contentRoute="/asset"/> 
        </header>
        <main className='mx-auto' style={{height: `${dvh * 80}px`, width: `${dvw * 90}px`}}>
         <div>
          
         </div>
        </main>
        {/* 페이지 이동을 위한 footer */}
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default StockPage;