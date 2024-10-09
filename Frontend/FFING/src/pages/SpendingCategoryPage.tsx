import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiChevronRight } from "@mdi/js";
import LinkHeader from "../components/Common/LinkHeader";
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import SpendingCategoryChart from "../components/Spending/CategoryChart";
import ExpenseDetail from "../components/Spending/ExpenseDetail";
import { getExpenseDetail } from "../api/SpendingApi";

interface MonthlyCategorySpending {
  expenseId: number;
  expenseName: string;
  expenseCategory: string;
  expenseMemo: string;
  expenseDate: string;
  expenseTime: string;
  expenseBalance: number;
}

const SpendingCategoryPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  // 카테고리 필터링을 위한 상태 (초기값은 'all'로 설정해 모든 거래 내역을 보여 줌)
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    "all"
  );
  const [categorySpending, setCategorySpending] = useState<
    MonthlyCategorySpending[]
  >([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // 중복된 API 호출 처리 로직을 함수로 분리
  const loadExpenseData = async (category: string) => {
    try {
      const response = await getExpenseDetail(category);
      setCategorySpending(response.data.result);
    } catch (error) {
      console.error("Error fetching spending data:", error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  // 카테고리 클릭 이벤트 함수에서 API 호출 및 로직 처리
  const handleCategoryClick = async (category: string) => {
    setLoading(true); // 로딩 시작
    // 빈 값이거나 undefined일 때
    if (!category) {
      setSelectedCategory("all");
      loadExpenseData(""); // 전체 데이터 다시 로드
      // 그 외에는 필터링
    } else {
      setSelectedCategory(category);
      loadExpenseData(category); // 카테고리 필터링된 데이터 로드
    }
  };

  // 선택한 카테고리에 맞는 거래 내역 필터링
  const filteredExpenses =
    selectedCategory === "all"
      ? categorySpending
      : categorySpending.filter(
          (expense) => expense.expenseCategory === selectedCategory
        );

  // 렌더링 되면 전체 데이터를 가져 옴
  useEffect(() => {
    loadExpenseData("");
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 메인 화면으로 되돌아가는 링크와 알람 header */}
        <header style={{ height: `${dvh * 10}px` }}>
          <LinkHeader contentName="항목별 지출" contentRoute="/main" />
        </header>
        <main
          className="mx-auto"
          style={{ height: `${dvh * 62}px`, width: `${dvw * 90}px` }}
        >
          {/* 이번 달 지출 금액 */}
          <div
            className="border-black border-4 rounded-lg"
            style={{ height: "50%" }}
          >
            <div className="flex justify-end items-center mt-4 mx-2">
              {/* 이번 달 지출 확인 route */}
              <Link to="monthly" className="flex items-center">
                <p style={{ color: "#F55322" }}>이번 달 지출</p>
                <Icon path={mdiChevronRight} size={1} color="#F55322" />
              </Link>
            </div>
            {/* 실제 지출 내역 확인 차트 */}
            <SpendingCategoryChart onClick={handleCategoryClick} />
          </div>
          {/* 항목 별 지출 내역 API 연동 필요*/}
          {/* 글자수 초과하면 ...으로 짜르기 */}
          <div>
            {loading ? (
              <div className="mt-8">
                <p>로딩 중...</p>
              </div> // 로딩 중일 때 보여줄 UI
            ) : (
              filteredExpenses.map((expense, index) => (
                <ExpenseDetail
                  key={index}
                  category={expense.expenseCategory}
                  title={expense.expenseName}
                  date={expense.expenseDate}
                  cost={expense.expenseBalance}
                />
              ))
            )}
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

export default SpendingCategoryPage;
