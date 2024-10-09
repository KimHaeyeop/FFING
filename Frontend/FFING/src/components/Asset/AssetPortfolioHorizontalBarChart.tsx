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
  const { assetType, setAssetTypeState } = useAssetType();

  if (!currentAsset) {
    return <p>자산 정보가 없습니다.</p>;
  }

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
      // borderRadius: index === 0 ? [10, 0, 0, 10] : 10, // 첫 번째 막대만 왼쪽을 둥글게
    })),
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false, // 이를 통해 높이를 직접 조절할 수 있습니다
    plugins: {
      legend: {
        display: false,
      },
    },
    title: {
      display: false,
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-center" style={{ height: "50px" }}>
        {/* 높이를 직접 지정합니다 */}
        <Bar data={data} options={options} />
      </div>
      {legends.map((legend, i) => {
        return (
          <div key={i} className="flex justify-between text-lg text-left my-2">
            <div className="flex items-center">
              <div
                className="h-8 w-8 rounded-full mx-4 text-left"
                style={{ backgroundColor: legend.color }}
              />
              <div>
                <p>{legend.title}</p>
                <p className="text-sm">{legend.percentage.toFixed(1)}%</p>
              </div>
            </div>
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
