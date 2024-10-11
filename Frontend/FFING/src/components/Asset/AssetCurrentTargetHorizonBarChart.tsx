import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

interface AssetPortfolioHorizontalBarChartProps {
  property: number;
  target: number;
}

const AssetCurrentTargetHorizonBarChart: React.FC<
  AssetPortfolioHorizontalBarChartProps
> = ({ property, target }) => {
  const progressPercentage = Math.min((property / target) * 100, 100);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center relative">
      {/* 전체 목표 바 */}
      <div
        className="w-full h-8 relative rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#828181" }}
      >
        {/* 달성한 자산 바 */}
        <div
          className="h-full transition-all duration-300 ease-in-out"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: "#BBEAED",
          }}
        />
        {/* 진행률 표시 */}
        <div className="absolute inset-0 flex items-center justify-center text-white font-galmuri-11-bold text-sm font-bold">
          {`${progressPercentage.toFixed(1)}%`}
        </div>
      </div>
      {/* 시작점 표시 */}
      <div className="absolute bottom-[-20px] left-[5%] transform -translate-x-1/2 text-xs">
        0원
      </div>
      {/* 목표액 표시 */}
      <div className="absolute bottom-[-20px] right-[10%] transform translate-x-1/2 text-xs">
        {formatCurrency(target)}
      </div>
    </div>
  );
};

export default AssetCurrentTargetHorizonBarChart;
