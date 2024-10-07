import React from 'react';

interface AssetPortfolioHorizontalBarChartProps {
  property: number;
  target: number;
}

const AssetCurrentTargetHorizonBarChart: React.FC<AssetPortfolioHorizontalBarChartProps> = ({ property, target }) => {
  const progressPercentage = (property / target) * 100;

  return (
    <div className="h-full w-full flex flex-col justify-center items-center relative">
      {/* 전체 목표 바 */}
      <div className="w-4/5 h-8 relative rounded-e-2xl" style={{ backgroundColor: '#828181' }}>
        {/* 달성한 자산 바 */}
        <div
          className="h-full transition-width duration-300 ease-in-out rounded-e-2xl"
          style={{ width: `${progressPercentage}%`, backgroundColor: '#BBEAED' }}
        >
          {/* 시작점 표시 */}
          <div className="absolute bottom-[-20px] left-0 transform -translate-x-1/2 text-xs">
            0원
          </div>
          {/* 달성율 표시 */}
          <div className="absolute bottom-[-30px] transform -translate-x-1/2 text-xs p-1 mt-2 rounded-2xl"
               style={{ left: `${progressPercentage}%`, backgroundColor: '#59DEE7' }}>
            {`${progressPercentage.toFixed(1)}%`}
          </div>
          {/* 목표액 표시 */}
          <div className="absolute bottom-[-20px] -right-10 transform -translate-x-1/2 text-xs">
            {`${(target / 10000).toLocaleString()}만 원`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCurrentTargetHorizonBarChart;