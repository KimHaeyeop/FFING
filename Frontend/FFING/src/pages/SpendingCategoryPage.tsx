import React from "react";
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronRight } from '@mdi/js';
import LinkHeader from '../components/Common/LinkHeader'
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import SpendingCategoryChart from "../components/Spending/CategoryChart";
import ExpenseDetail from "../components/Spending/ExpenseDetail";

const SpendingCategoryPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  // 카테고리 필터링을 위한 상태 (초기값은 'all'로 설정해 모든 거래 내역을 보여 줌)
  const [selectedCategory, setSelectedCategory] = React.useState('all');


  // 카테고리 별 지출액 (API 연동 필요)
  const spendingData = [1824691, 456172, 1368518, 2280864, 1824691, 1368518]

  // 카테고리 별 상세 지출 (API 연동 필요)
  const expenseDetail = [
    { category: '식비', title: '이정닭갈비&냉면 동탄점', date: '2024.09.05 22:17', cost: 32500 },
    { category: '식비', title: '옛날멸치국수', date: '2024.08.24 11:11', cost: 44400 },
    { category: '생활/문화', title: '(주) 보나비', date: '2024.07.30 18:58', cost: 8900 },
    { category: '금융', title: '양우성', date: '2024.07.29 12:35', cost: 5000 },
    { category: '금융', title: '윤요한', date: '2024.07.28 08:55', cost: 1000 },
    { category: '금융', title: 'LH 이규석', date: '2024.07.26 18:18', cost: 64250 },
    { category: '금융', title: '행복주택28단지관리', date: '2024.07.26 18:17', cost: 54130 },
    { category: '문화', title: '요기 yogi 스터디카페', date: '2024.07.16 14:17', cost: 9000 },
    { category: '교통', title: 'KB 카드출금', date: '2024.09.10 07:05', cost: 3301 },
  ];

  // 차트에서 카테고리를 클릭하면 해당 카테고리로 필터링
  const handleCategoryClick = (category: string) => {
    // 다른 곳을 누르거나 잔여를 누른다면
    if (category === '' || category === '잔여') {
      setSelectedCategory('all')
    // 그 외에는 필터링
    } else {
      setSelectedCategory(category);
    }
  };

  // 선택한 카테고리에 맞는 거래 내역 필터링
  const filteredExpenses = selectedCategory === 'all'
    ? expenseDetail
    : expenseDetail.filter(expense => expense.category === selectedCategory);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 메인 화면으로 되돌아가는 링크와 알람 header */}
        <header style={{height: `${dvh * 10}px`}}>
          <LinkHeader contentName="지출" contentRoute="/"/> 
        </header>
        <main className='mx-auto'style={{height: `${dvh * 75}px`, width: `${dvw * 90}px`}}>
          {/* 이번 달 지출 금액 */}
          <div className="border-black border-4 rounded-lg" style={{height: '40%'}}>
            <div className='flex justify-end items-center mt-2 mx-2'>
              {/* 이번 달 지출 확인 route */}
              <Link to='/' className='flex items-center'>
                <p style={{color:'#F55322'}}>이번 달 지출</p>
                <Icon path={mdiChevronRight} size={1} color='#F55322'/>
              </Link>
            </div>
            {/* 실제 지출 내역 확인 차트 */}
            <SpendingCategoryChart chartData={spendingData} onClick={handleCategoryClick} />
          </div>
          {/* 항목 별 지출 내역 API 연동 필요*/}
          <div >
            {filteredExpenses.map((expense, index) => (
                <ExpenseDetail
                  key={index}
                  category={expense.category}
                  title={expense.title}
                  date={expense.date}
                  cost={expense.cost}
                />
              ))}
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