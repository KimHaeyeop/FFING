import React from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import useAssetType from "../../store/userAssetType";
import { formatCurrency } from "../../utils/formatCurrency";

interface currentAssets {
  accountBalance: number;
  assetId: number;
  depositSavingsBalance: number;
  othersBalance: number;
  stockBalance: number;
  totalAsset: number;
  updatedDate: string;
}

interface AssetPortfolioHorizontalBarChartProps {
  currentAsset: currentAssets | undefined;
}

const AssetPortfolioHorizontalBarChart: React.FC<
  AssetPortfolioHorizontalBarChartProps
> = ({ currentAsset }) => {
  const navigate = useNavigate();
  const { assetType, setAssetTypeState } = useAssetType(); // 선택한 자산의 타입을 관리

  // 현재 자산 정보가 없으면
  if (!currentAsset) {
    return <p>자산 정보가 없습니다.</p>;
  }

  // 예/적금, 입출금 -> product 페이지로, 주식 -> stock 페이지로
  const handleBalance = (title: string) => {
    setAssetTypeState(title);
    if (title === "주식") {
      navigate("stock");
    } else if (title === "예금/적금" || title === "입출금 통장") {
      navigate("product");
    }
  };

  const legends = [
    {
      title: "예금/적금",
      balance: currentAsset.depositSavingsBalance,
      percentage:
        (currentAsset.depositSavingsBalance / currentAsset.totalAsset) * 100,
      color: "#7C00FE",
    },
    {
      title: "입출금 통장",
      balance: currentAsset.accountBalance,
      percentage: (currentAsset.accountBalance / currentAsset.totalAsset) * 100,
      color: "#F9E400",
    },
    {
      title: "주식",
      balance: currentAsset.stockBalance,
      percentage: (currentAsset.stockBalance / currentAsset.totalAsset) * 100,
      color: "#FFAF00",
    },
    {
      title: "기타 자산",
      balance: currentAsset.othersBalance,
      percentage: (currentAsset.othersBalance / currentAsset.totalAsset) * 100,
      color: "#F5004F",
    },
  ];

  const data = {
    labels: ["비율(%)"],
    datasets: legends.map((legend, index) => ({
      label: legend.title,
      data: [legend.percentage],
      backgroundColor: legend.color,
      // 수평 막대 그래프의 시작과 끝 모서리를 둥글게
      borderRadius: {
        topLeft: index === 0 ? 10 : 0, // 첫 번째 막대의 왼쪽 상단 둥글게
        bottomLeft: index === 0 ? 10 : 0, // 첫 번째 막대의 왼쪽 하단 둥글게
        topRight: index === legends.length - 1 ? 10 : 0, // 마지막 막대의 오른쪽 상단 둥글게
        bottomRight: index === legends.length - 1 ? 10 : 0, // 마지막 막대의 오른쪽 하단 둥글게
      },
      borderSkipped: false, // 막대의 모든 모서리에 대해 둥글게 적용
    })),
  };

  const options = {
    indexAxis: "y" as const, // 수평 바 차트
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    title: {
      display: false, // 차트 제목 숨기기
    },
    layout: {
      padding: {
        left: -10, // 왼쪽 패딩 보정
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false, // x축 배경 grid 삭제
        },
        ticks: {
          display: false, // x축 인덱스 삭제
        },
        border: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false, // y축 배경 grid 삭제
        },
        ticks: {
          display: false, // y축 인덱스 삭제
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-center w-full" style={{ height: "50px" }}>
        <Bar data={data} options={options} />
      </div>
      {legends.map((legend, i) => {
        return (
          <div key={i} className="flex justify-between text-lg text-left my-2">
            <div className="flex items-center">
              {/* 색상 */}
              <div
                className="h-8 w-8 rounded-full ml-2 mr-4 text-left"
                style={{ backgroundColor: legend.color }}
              />
              {/* 금융 상품과 비율 */}
              <div>
                <p>{legend.title}</p>
                <p className="text-sm">{legend.percentage.toFixed(2)}%</p>
              </div>
            </div>
            {/* 금액 */}
            <div>
              <p className="flex" onClick={() => handleBalance(legend.title)}>
                <span className="font-galmuri-11-bold">
                  {formatCurrency(legend.balance)}
                </span>
                <Icon path={mdiChevronRight} size={1} />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssetPortfolioHorizontalBarChart;
