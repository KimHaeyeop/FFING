import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiTriangle, mdiTriangleDown } from "@mdi/js";
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import LinkHeader from "../components/Common/LinkHeader";
import AssetCurrentTargetHorizonBarChart from "../components/Asset/AssetCurrentTargetHorizonBarChart";
import AssetPortfolioHorizontalBarChart from "../components/Asset/AssetPortfolioHorizontalBarChart";
import AssetTimeSeriesChart from "../components/Asset/AssetTimeSeriesChart";
import { getTotalAsset } from "../api/AssetApi";

interface currentAssets {
  accountBalance: number;
  assetId: number;
  depositSavingsBalance: number;
  othersBalance: number;
  stockBalance: number;
  totalAsset: number;
  updatedDate: string;
}

const AssetMainPage: React.FC = () => {
  const [property, setProperty] = React.useState(100000);
  const [target, setTarget] = React.useState(200000);
  const [currentAsset, setCurrentAsset] = React.useState<currentAssets>()

  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  // 이번 달 지출액을 가져오는 함수
  const fetchData = async () => {
    try {
      // 적절한 유저 이름 설정 필요
      const response = await getTotalAsset('1');
      setProperty(response.data.result.currentAsset.totalAsset);
      setCurrentAsset(response.data.result.currentAsset)
      // 목표 가져오는 API 연동 필요
      // setTarget(response.data.result.totalExpense)
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
          <LinkHeader contentName="자산" contentRoute="/"/> 
        </header>
        <main className='mx-auto' style={{height: `${dvh * 80}px`, width: `${dvw * 90}px`}}>
          {/* 자산 목표 확인 */}
          <div>
            {/* 자산 목표 확인, API 적용 */}
            <div className="text-2xl text-left">
              {/* 현재 연도 정보 가져오기 */}
              <p>2024년 자산 목표</p>
              <p className="font-galmuri-11-bold">3000만 원 모으기</p>
              {/* 목표액 정도를 나타낸 바 차트 */}
              <div className="flex justify-center">
                <AssetCurrentTargetHorizonBarChart property={property} target={target}/>
              </div>
            </div>
          </div>
          {/* 현재 자산 & 월평균 저축 */}
          <div className="bg-[#BBEAED] bg-opacity-20 content-around" style={{height: '25%'}}>
            {/* 현재 순자산 */}
            <div className="flex justify-around my-4">
              <p>현재 순자산</p>
              <div>
                <p style={{color: '#67BA82'}}>1080만 원</p>
                <p className="text-sm">시작 금액 880만 원</p>
              </div>
            </div>
            {/* 월 평균 저축 */}
            <div className="flex justify-around my-4">
              <p >월 평균 저축</p>
              {/* API 연동 필요 */}
              <div>
                <p style={{color: '#67BA82'}}>540,982원</p>
                <p className="text-sm">목표 적금액 60만 원</p>
              </div>
            </div>
          </div>
          {/* 자산 현황 */}
          <div>
            <AssetPortfolioHorizontalBarChart currentAsset={currentAsset} />
          </div>
          {/* 전월 비교 */}
          <div>
            <div className="text-left text-xl my-8">
                <span >9월보다</span>
                <br />
                {dvw < 0.1 ? (
                // {lastMonthExpense > previousMonthExpense ? (
                  <div className="flex items-center">
                    <Icon path={mdiTriangle} size={1} style={{color: '#465A65'}}></Icon>
                    {/* <span className="font-galmuri-11-bold text-2xl" style={{color: '#465A65'}}>{(lastMonthExpense - previousMonthExpense).toLocaleString()}원</span> */}
                    <span className="font-galmuri-11-bold text-xl" style={{color: '#465A65'}}>{(10000000 - 5000000).toLocaleString()}원</span>
                    &nbsp;
                    <span>늘었어요</span>
                  </div>
                ) : ( 
                  <div className="flex">
                    <Icon path={mdiTriangleDown} size={1} style={{color: '#465A65'}}></Icon>
                    <span className="font-galmuri-11-bold text-xl" style={{color: '#465A65'}}>{(5000000 - 10000000).toLocaleString()}원</span>
                    {/* <span className="font-galmuri-11-bold text-2xl" style={{color: '#465A65'}}>{(previousMonthExpense - lastMonthExpense).toLocaleString()}원</span> */}
                    &nbsp;
                    <span>줄었어요</span>
                  </div>
                )
                }
              </div>
            <div>
              <AssetTimeSeriesChart />
            </div>
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

export default AssetMainPage;