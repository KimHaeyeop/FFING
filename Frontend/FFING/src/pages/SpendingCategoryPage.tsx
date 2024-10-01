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
  // 카테고리 별 지출액 (API 연동 필요)
  const spendingData = [1824691, 456172, 1368518, 2280864, 1824691, 1368518]

  // 카테고리 별 상세 지출 (API 연동 필요)
  const expenseDetail = [
    { category: 'food', title: '이정닭갈비&냉면 동탄점', date: '2024.09.05 22:17', cost: 32500 },
    { category: 'food', title: '옛날멸치국수', date: '2024.08.24 11:11', cost: 44400 },
    { category: 'living', title: '(주) 보나비', date: '2024.07.30 18:58', cost: 8900 },
    { category: 'finance', title: '양우성', date: '2024.07.29 12:35', cost: 5000 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
    { category: 'shopping', title: 'ABC마트 동탄점', date: '2024.08.22 20:17', cost: 6800 },
  ];

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
              <Link to='/' className='flex items-center'>
                <p style={{color:'#F55322'}}>이번 달 지출</p>
                <Icon path={mdiChevronRight} size={1} color='#F55322'/>
              </Link>
            </div>
            <SpendingCategoryChart chartData={spendingData}/>
          </div>
          {/* 항목 별 지출 내역 API 연동 필요*/}
          <div >
            {expenseDetail.map((expense, index) => (
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