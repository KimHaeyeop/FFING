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
import { formatCurrency } from "../utils/formatCurrency";
import { useAuthStore } from "../store/authStore";
import { getCurrentMonth } from "../utils/dataUtils";

interface assetHistoryInterface {
  assetId: number;
  totalAsset: number;
  accountBalance: number;
  depositSavingsBalance: number;
  stockBalance: number;
  othersBalance: number;
  updatedDate: string;
}

interface assetGoalInterface {
  averageIncrese: number;
  createdDate: string;
  goalBalance: number;
  startBalance: number;
  targetIncrese: number;
}

interface currentAssetInterface {
  accountBalance: number;
  assetId: number;
  depositSavingsBalance: number;
  othersBalance: number;
  stockBalance: number;
  totalAsset: number;
  updatedDate: string;
}

const AssetMainPage: React.FC = () => {
  const { userId } = useAuthStore();
  const [currentAsset, setCurrentAsset] = useState<currentAssetInterface | null>(null); // 현재 자산 데이터
  const [assetGoal, setAssetGoal] = useState<assetGoalInterface>({
    averageIncrese: 0,
    createdDate: '',
    goalBalance: 0,
    startBalance: 0,
    targetIncrese: 0,
  });
  const [assetHistory, setAssetHistory] = useState<assetHistoryInterface>({
    assetId: 0,
    totalAsset: 0,
    accountBalance: 0,
    depositSavingsBalance: 0,
    stockBalance: 0,
    othersBalance: 0,
    updatedDate: '',
  }

  ); // 자산 변동 기록

  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const todayYear = new Date().getFullYear(); // 현재 연도
  console.log(assetHistory[0], assetHistory[1])
  const assetDifference = assetHistory[0].totalAsset - assetHistory[1].totalAsset;
  const iconPath = assetDifference > 0 ? mdiTriangle : mdiTriangleDown;
  const message = assetDifference > 0 ? "늘었어요!" : "줄었어요!";

  // API로 자산 데이터를 가져오는 함수
  const fetchData = async () => {
    try {
      const response = await getTotalAsset(String(userId));
      const { currentAsset, assetGoal, assetHistory } = response.data.result;

      setCurrentAsset(currentAsset);  // 현재 자산 설정
      setAssetHistory(assetHistory);  // 자산 변동 추이 설정
      setAssetGoal(assetGoal);        // 목표 자산 설정

      console.log(response.data.result.assetGoal.targetIncrease)
    } catch (error) {
      console.error("Error fetching certain asset data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{ height: `${dvh * 10}px` }}>
          <LinkHeader contentName="자산" contentRoute="/main" />
        </header>
        <main
          className="mx-auto"
          style={{ height: `${dvh * 80}px`, width: `${dvw * 90}px` }}
        >
          {/* 자산 목표 확인 */}
          <div>
            <div className="text-2xl text-left">
              <p>{todayYear}년 자산 목표</p>
              <p className="font-galmuri-11-bold">
                {formatCurrency(assetGoal.goalBalance)} 모으기
              </p>
              <div className="flex justify-center my-8">
                {currentAsset && (
                  <AssetCurrentTargetHorizonBarChart
                    property={currentAsset.totalAsset}
                    target={assetGoal.goalBalance}
                  />
                )}
              </div>
            </div>
          </div>

          {/* 현재 자산 & 월평균 저축 */}
          <div className="bg-[#BBEAED] bg-opacity-20 content-around h-1/4 rounded-xl mt-10 mb-4">
            <div className="flex justify-between m-4">
              <p className="flex items-center text-left">현재 순자산</p>
              <div className="text-right">
                <p className="font-galmuri-11-bold">
                  {currentAsset ? formatCurrency(currentAsset.totalAsset) : '로딩 중'}
                </p>
                <p className="text-sm">
                  시작 금액{" "}
                  <span className="font-galmuri-11-bold">
                    {formatCurrency(assetGoal.startBalance)}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex justify-between m-4">
              <p className="flex items-center text-left">월 평균 저축</p>
              <div className="text-right">
                <p className="font-galmuri-11-bold">
                  {formatCurrency(assetGoal.averageIncrese)}
                </p>
                <p className="text-sm">
                  목표 적금액{" "}
                  <span className="font-galmuri-11-bold">
                    {formatCurrency(assetGoal.targetIncrese)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 자산 현황 */}
          <div>
            {currentAsset && <AssetPortfolioHorizontalBarChart currentAsset={currentAsset} />}
          </div>

          {/* 전월 비교 */}
          <div>
            <div className="text-left text-xl my-8">
              <span>{getCurrentMonth() - 1}월보다</span>
              <br />
              <div className="flex items-center">
                <Icon
                  path={iconPath}
                  size={1}
                  style={{ color: "#465A65" }}
                />
                <span
                  className="font-galmuri-11-bold text-xl"
                  style={{ color: "#465A65" }}
                >
                  {formatCurrency(assetDifference)}
                </span>
                &nbsp;
                <span>{message}</span>
              </div>
            </div>

            {/* 월 별 자산 증감 내역 확인하는 차트 */}
            <div className="pb-24">
              <AssetTimeSeriesChart assetHistory={assetHistory} />
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
