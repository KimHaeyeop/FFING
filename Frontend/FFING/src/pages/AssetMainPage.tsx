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
import { getTargetPropertySpending } from '../api/goalApi'
import { formatCurrency } from "../utils/formatCurrency";

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
  const [property, setProperty] = React.useState(0);
  const [target, setTarget] = React.useState(0);
  const [currentAsset, setCurrentAsset] = React.useState<currentAssets>()

  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const todayYear = new Date().toISOString().split('T')[0].replace(/-/g, '').slice(0, 4)
  
  // 이번 달 지출액을 가져오는 함수
  const fetchData = async () => {
    try {
      // 적절한 유저 이름 설정 필요
      const response = await getTotalAsset('1');
      const responseGoal = await getTargetPropertySpending('1')

      setProperty(response.data.result.currentAsset.totalAsset);  // 현재 자산 설정
      setTarget(responseGoal.data.result.goalBalance) // 목표 자산 설정
      setCurrentAsset(response.data.result.currentAsset)  // 현재 자산 관련 정보 저장
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
          <LinkHeader contentName="자산" contentRoute="/main"/> 
        </header>
        <main className='mx-auto' style={{height: `${dvh * 80}px`, width: `${dvw * 90}px`}}>
          {/* 자산 목표 확인 */}
          <div>
            {/* 자산 목표 확인, API 적용 */}
            <div className="text-2xl text-left">
              {/* 현재 연도 정보 가져오기 */}
              <p>{todayYear}년 자산 목표</p>
              {/* 목표액 API 연동 */}
              <p className="font-galmuri-11-bold">{formatCurrency(target)} 모으기</p>
              {/* 목표액 정도를 나타낸 바 차트 */}
              <div className="flex justify-center my-10">
                <AssetCurrentTargetHorizonBarChart property={property} target={target}/>
              </div>
            </div>
          </div>
          {/* 현재 자산 & 월평균 저축 */}
          <div className="bg-[#BBEAED] bg-opacity-20 content-around" style={{height: '25%'}}>
            {/* 현재 순자산 */}
            <div className="flex justify-between m-4">
              <p className="flex items-center text-left">현재 순자산</p>
              <div className="text-right">
                <p style={{color: '#67BA82'}} className="font-galmuri-11-bold">{formatCurrency(property)}</p>
                {/* API 연동 필요 */}
                <p className="text-sm">시작 금액 <span className="font-galmuri-11-bold">{formatCurrency(10000)}</span></p>
              </div>
            </div>
            {/* 월 평균 저축 */}
            <div className="flex justify-between m-4">
              <p className="flex items-center text-left">월 평균 저축</p>
              <div className="text-right">
                {/* API 연동 필요 */}
                <p style={{color: '#67BA82'}} className="font-galmuri-11-bold">※API※만 원</p>
                <p className="text-sm">목표 적금액<span className="font-galmuri-11-bold">※API※만 원</span></p>
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
            {/* 월 별 자산 증감 내역 확인하는 차트 API 연동 필요 */}
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