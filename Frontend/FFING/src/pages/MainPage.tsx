import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import TextHeader from "../components/Common/TextHeader";
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import SpendingMonthlyChart from "../components/Spending/MonthlyChart";
import { requestPermissionAndGetToken } from "../service/firebase";
const MainPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  useEffect(() => {
    const initializeFCM = async () => {
      const userId = 1; // 예시 사용자 ID, 실제 존재하는 ID로 변경해야 함
      try {
        const token = await requestPermissionAndGetToken(userId);
        console.log("Obtained FCM Token:", token);
      } catch (error) {
        console.error("Error obtaining FCM token:", error);
      }
    };

    initializeFCM();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{ height: `${dvh * 10}px` }}>
          <TextHeader title="이규석 님" />
        </header>
        <main
          className="mx-auto"
          style={{ height: `${dvh * 75}px`, width: `${dvw * 90}px` }}
        >
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
            <SpendingMonthlyChart chartData={[20, 5, 15, 25, 20, 15]} />
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
