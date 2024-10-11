import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  layouts,
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

const MonthlyDoughnutChart: React.FC = () => {
  const [spendingData, setSpendingData] = useState<MonthlyCategorySpending[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getThisMonthCategorySpending();
        setSpendingData(response.data.result);
      } catch (error) {
        console.error("Error fetching spending data:", error);
      }
    };
    fetchData();
  }, []);

  const targetSpending = 100000;

  const mapKrUs: { [key: string]: string } = {
    FINANCE: "금융",
    FOOD_BAKERY: "음식/외식",
    LIFE_CULTURE: "생활/문화",
    SHOPPING: "쇼핑",
    TRANSPORTATION: "교통",
  };

  const filteredData = Array.isArray(spendingData)
    ? spendingData
        .filter((item) => item.category !== "OVERSEAS")
        .sort((a, b) => b.totalAmount - a.totalAmount)
    : [];

  const config = {
    data: {
      labels: [...filteredData.map((item) => mapKrUs[item.category]), "잔여"],
      datasets: [
        {
          label: "총 지출 대비(%)",
          data: [
            ...filteredData.map((item) => item.totalAmount),
            targetSpending,
          ],
          backgroundColor: [
            "#80B2FF",
            "#FF80EB",
            "#FFCC80",
            "#FF808F",
            "#80FF8D",
            "#D9D9D9",
          ],
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          position: "right" as const,
          labels: {
            boxWidth: 15,
            font: {
              family: "Galmuri11-Bold", // Apply the font here
            },
            generateLabels: (chart: Chart) => {
              const data = chart.data;
              return data.labels!.map((label, i) => {
                const value = data.datasets![0].data[i] as number;
                const total = data.datasets![0].data.reduce(
                  (a, b) => (a as number) + (b as number),
                  0
                );
                const percentage = ((value / total) * 100).toFixed(0);
                return {
                  text: `${label} ${percentage}%`,
                  fillStyle: data.datasets![0].backgroundColor[i] as string,
                  hidden: false,
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
    <div className="flex justify-center items-center">
      <Doughnut {...config} />
    </div>
  );
};

export default MonthlyDoughnutChart;
