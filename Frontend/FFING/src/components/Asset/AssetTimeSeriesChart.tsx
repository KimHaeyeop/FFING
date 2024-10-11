import React from "react";
import { Bar } from "react-chartjs-2";

interface assetHistoryProps {
  assetHistory: assetHistoryInterface[];
}

interface assetHistoryInterface {
  assetId: number;
  totalAsset: number;
  accountBalance: number;
  depositSavingsBalance: number;
  stockBalance: number;
  othersBalance: number;
  updatedDate: string;
}

const AssetTimeSeriesChart: React.FC<assetHistoryProps> = ({ assetHistory }) => {

  // 현재 날짜부터 6개월 전까지의 월 이름을 labels로 가져오기
  const getLastFiveMonths = (): string[] => {
    const months = [];
    const today = new Date();
  
    for (let i = 0; i < 6; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthLabel = `${String(month.getMonth() + 1)}월`; // 'MM월' 형식
      months.push(monthLabel); 
    }
  
    return months.reverse(); // 배열을 최신 월 순서로 변경
  };

  // assetHistory 데이터에서 updatedDate로 월에 맞는 totalAsset 데이터를 가져오기
  const getAssetDataForMonths = (months: string[]): number[] => {
    const monthToAssetMap: { [key: string]: number } = {};

    // assetHistory를 순회하며, 각 자산의 월에 맞는 데이터를 맵에 저장
    assetHistory.forEach((asset) => {
      const updatedMonth = new Date(
        asset.updatedDate.substring(0, 4), // 연도
        asset.updatedDate.substring(4, 6) - 1 // 월 (0부터 시작하는 월이므로 -1)
      ).getMonth() + 1;

      // 해당 월의 자산 데이터 매핑 (월 -> totalAsset)
      const monthLabel = `${updatedMonth}월`;
      monthToAssetMap[monthLabel] = asset.totalAsset;
    });

    // 최신 5개월의 labels에 맞는 자산 데이터를 배열로 반환
    return months.map((month) => monthToAssetMap[month] || 0); // 데이터가 없으면 0으로 처리
  };

  const labels = getLastFiveMonths(); // 최신 5개월의 월 labels 가져오기
  const data = getAssetDataForMonths(labels); // labels에 맞는 자산 데이터 가져오기

  const config = {
    data: {
      labels: labels, // 레이블은 최신 5개월
      datasets: [
        {
          data: data, // assetHistory에서 가져온 자산 데이터
          backgroundColor: [
            "#B1B1B1",
            "#B1B1B1",
            "#B1B1B1",
            "#B1B1B1",
            "#B1B1B1",
            "#C8A1E0",
          ],
          borderRadius: 5, // 바의 모서리 둥글기
        },
      ],
    },
    options: {
      responsive: false, // 화면 크기는 내가 조정함
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false, // x축 배경 grid 삭제
          },
          border: {
            display: true,
            width: 0,
            z: 1,
          },
          ticks: {
            font: {
              family: "'Galmuri11'",
              size: 14, // 레이블 폰트 크기 설정
            },
          },
        },
        y: {
          display: false,
          grid: {
            display: false, // y축 배경 grid를 유지하되,
            drawBorder: false, // y축 테두리 제거
            drawTicks: false, // y축 눈금 제거
            color: (context) =>
              context.tick.value === 0 ? "#D9D9D9" : "rgba(0, 0, 0, 0)", // y=0에서만 선을 표시하고 나머지는 투명
            lineWidth: (context) => (context.tick.value === 0 ? 2 : 0), // y=0에서 x축만 강조
          },
          ticks: {
            display: false, // y축 인덱스 삭제
          },
        },
      },
    },
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      <Bar {...config} />
    </div>
  );
};

export default AssetTimeSeriesChart;
