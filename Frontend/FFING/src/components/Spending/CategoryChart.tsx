import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  layouts,
  ChartEvent,
  ActiveElement,
  Chart,
} from "chart.js";
import { getThisMonthCategorySpending } from "../../api/SpendingApi";

ChartJS.register(ArcElement, Tooltip, Legend);

interface MonthlyCategorySpending {
  category: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  target: number;
}

interface SpendingCategoryChartProps {
  onClick: (category: string) => void; // 카테고리를 클릭했을 때 호출하는 함수
}

const SpendingCategoryChart: React.FC<SpendingCategoryChartProps> = ({
  onClick,
}) => {
  const [highlightedCategory, setHighlightedCategory] = useState<string | null>(
    null
  ); // 누른 카테고리를 강조하기 위한 상태 관리
  const [spendingData, setSpendingData] = useState<MonthlyCategorySpending[]>(
    []
  );

  // 카테고리 별 지출액을 가져오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getThisMonthCategorySpending();
        setSpendingData(response.data.result); // 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching spending data:", error);
      }
    };

    fetchData();
  }, []);

  // FINANCE, FOOD_BAKERY, LIFE_CULTURE, SHOPPING, TRANSPORTATION, OVERSEAS
  // key를 문자열로 사용 가능하게 변경
  const mapKrUs: { [key: string]: string } = {
    FINANCE: "금융",
    FOOD_BAKERY: "음식/외식",
    LIFE_CULTURE: "생활/문화",
    SHOPPING: "쇼핑",
    TRANSPORTATION: "교통",
  };

  // 해외 카테고리 삭제 전까지 이 걸로 진행해야 함
  const filteredData = spendingData
    .filter((item) => item.category !== "OVERSEAS")
    .sort((a, b) => b.totalAmount - a.totalAmount); // 차트 정렬하기

  // 범례 클릭 시 카테고리 필터링 및 전달하는 함수
  const handleLegendClick = (
    event: React.MouseEvent<HTMLLIElement>,
    legendItem: any
  ) => {
    // 기존 강조된 항목을 다시 클릭하면 필터링 해제
    if (legendItem.text.split(" ")[0] === highlightedCategory) {
      setHighlightedCategory(null);
      onClick("");
      // 필터링 설정
    } else {
      const categoryLabel = legendItem.text.split(" ")[0];
      const category = Object.keys(mapKrUs).find(
        (key) => mapKrUs[key] === categoryLabel
      ); // 카테고리 매핑
      setHighlightedCategory(categoryLabel); // 클릭된 카테고리 강조
      onClick(category!); // 카테고리 전달
    }
  };

  const config = {
    data: {
      labels: [...filteredData.map((item) => mapKrUs[item.category])],
      datasets: [
        {
          label: "총 지출 대비(%)",
          data: [...filteredData.map((item) => item.totalAmount)],
          backgroundColor: [
            "#80B2FF",
            "#FF80EB",
            "#FFCC80",
            "#FF808F",
            "#80FF8D",
          ],
        },
      ],
    },
    // 범례 label과 value 사이의 거리 이격 필요
    options: {
      responsive: false,
      plugins: {
        legend: {
          onClick: handleLegendClick, // 범례 클릭 시 실행되는 함수
          position: "right" as const, // 차트 오른편에 범례
          labels: {
            boxWidth: 15, // 범례 색상 공간의 너비 수정
            // 범례 색상의 테두리 삭제 필요
            generateLabels: (chart: Chart) => {
              const data = chart.data;
              return data.labels?.map((label, i) => {
                const value = data.datasets[0].data[i];
                const formattedValue = value?.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                });
                return {
                  text: `${label} ${formattedValue}원`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  fontColor:
                    label === highlightedCategory ? "#000000" : "#D9D9D9", // 이거 아직 안 되서 수정해야 함
                  index: i,
                };
              });
            },
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    },
  };

  return (
    <div className="w-full flex justify-center items-center my-4">
      <Doughnut {...config} />
    </div>
  );
};

export default SpendingCategoryChart;
