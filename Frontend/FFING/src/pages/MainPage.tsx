import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import TextHeader from "../components/Common/TextHeader";
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import MonthlyDoughnutChart from "../components/Spending/MonthlyDoughnutChart";
import { get1, get2, get3, get4, get5, get6, get7 } from "../api/assetApi";

const MainPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  // 테스트
  const fetchData = async () => {
    try {
      const response = await get3();
      console.log(response);
    } catch (error) {
      console.error("Error fetching certain spending data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{ height: `${dvh * 10}px` }}>
          <TextHeader title="이규석 님" />
        </header>
        <main
          className="mx-auto"
          style={{ height: `${dvh * 80}px`, width: `${dvw * 90}px` }}
        >
          {/* 자산 목표 달성 관련 */}
          <div
            className="border-black border-4 rounded-lg"
            style={{ height: "20%" }}
          >
            목표 달성까지
          </div>
          <div
            className="border-black border-x-4 rounded-lg"
            style={{ height: "40%" }}
          >
            펫 화면
          </div>
          <div
            className="border-black border-4 rounded-lg"
            style={{ height: "40%" }}
          >
            <div className="flex justify-between items-center mt-2 mx-2">
              <p className="text-xl">이번달 지출내역</p>
              <Link to="/spending" className="flex items-center">
                <p style={{ color: "#F55322" }}>9,123,456원</p>
                <Icon path={mdiChevronRight} size={1} color="#F55322" />
              </Link>
            </div>
            {/* 이번 달 지출 내역을 나타내는 차트 API 연동 필요*/}
            <MonthlyDoughnutChart />
          </div>
        </main>
        <footer style={{ height: `${dvh * 10}px` }}>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default MainPage;
