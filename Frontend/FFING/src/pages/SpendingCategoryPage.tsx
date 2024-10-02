import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronRight } from '@mdi/js';
import LinkHeader from '../components/Common/LinkHeader'
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import SpendingCategoryChart from "../components/Spending/CategoryChart";
import ExpenseDetail from "../components/Spending/ExpenseDetail";
import { getExpenseDetail } from '../api/SpendingApi';

interface MonthlyCategorySpending {
  expenseId: number,
  expenseName: string,
  expenseCategory: string,
  expenseMemo: string,
  expenseDate: string,
  expenseTime: string,
  expenseBalance: number,
}

const SpendingCategoryPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  // 카테고리 필터링을 위한 상태 (초기값은 'all'로 설정해 모든 거래 내역을 보여 줌)
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [categorySpending, setCategorySpending] = useState<MonthlyCategorySpending[]>([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  
  // 전체 거래 데이터를 가져오는 함수
  const fetchData = async () => {
    try {
      const response = await getExpenseDetail('');
      console.log(response.data.result);
      setSelectedCategory('all')
      setLoading(false)
      setCategorySpending(response.data.result); // 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching categorySpending data:', error);
    }
  };

  // 차트에서 카테고리를 클릭하면 해당 카테고리로 필터링
  const handleCategoryClick = async (category: string) => {
    console.log(category)
    // 다른 곳을 누르거나 잔여를 누른다면
    if (category === undefined || category === '') {  
      setSelectedCategory('all')
      setLoading(false); // 'all'을 선택한 경우에도 로딩 완료로 처리
      fetchData()
    // 그 외에는 필터링
    } else {
      try {
        const response = await getExpenseDetail(category);
        setSelectedCategory(category)
        setCategorySpending(response.data.result); // 데이터를 상태에 저장
      } catch (error) {
        console.error('Error fetching spending data:', error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    }
  };

  // 선택한 카테고리에 맞는 거래 내역 필터링
  const filteredExpenses = selectedCategory === 'all'
    ? categorySpending
    : categorySpending.filter(expense => expense.expenseCategory === selectedCategory);

  // 렌더링 되면 전체 데이터를 가져 옴
  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 메인 화면으로 되돌아가는 링크와 알람 header */}
        <header style={{height: `${dvh * 10}px`}}>
          <LinkHeader contentName="항목별 지출" contentRoute="/"/> 
        </header>
        <main className='mx-auto'style={{height: `${dvh * 80}px`, width: `${dvw * 90}px`}}>
          {/* 이번 달 지출 금액 */}
          <div className="border-black border-4 rounded-lg" style={{height: '40%'}}>
            <div className='flex justify-end items-center mt-2 mx-2'>
              {/* 이번 달 지출 확인 route */}
              <Link to='monthly' className='flex items-center'>
                <p style={{color:'#F55322'}}>이번 달 지출</p>
                <Icon path={mdiChevronRight} size={1} color='#F55322'/>
              </Link>
            </div>
            {/* 실제 지출 내역 확인 차트 */}
            <SpendingCategoryChart onClick={handleCategoryClick} />
          </div>
          {/* 항목 별 지출 내역 API 연동 필요*/}
          {/* 글자수 초과하면 ...으로 짜르기 */}
          <div>
            {loading ? (
                <p>로딩 중...</p> // 로딩 중일 때 보여줄 UI
              ) : (filteredExpenses.map((expense, index) => (
                <ExpenseDetail
                  key={index}
                  category={expense.expenseCategory}
                  title={expense.expenseName}
                  date={expense.expenseDate}
                  cost={expense.expenseBalance}
                />
              ))
            )
          }
          </div>
        </main>
        {/* 페이지 이동을 위한 footer */}
        <footer style={{height: `${dvh * 10}px`}}>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default SpendingCategoryPage;