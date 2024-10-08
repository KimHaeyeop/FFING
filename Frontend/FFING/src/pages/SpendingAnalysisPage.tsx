import React from "react";
// import { useState } from "react";
// import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiTriangle, mdiTriangleDown } from '@mdi/js';
import LinkHeader from '../components/Common/LinkHeader'
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import MonthlyBarChart from "../components/Spending/MonthlyBarChart";

const SpendingCategoryPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  // API 연동 필요
  const MonthlyExpenses = [100000, 200000, 300000, 400000, 500000, 600000]
  const lastMonthExpense = MonthlyExpenses[MonthlyExpenses.length - 1]; 
  const previousMonthExpense = MonthlyExpenses[MonthlyExpenses.length - 2];

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 월간 지출 내역으로 되돌아가는 링크와 알람 header */}
        <header style={{height: `${dvh * 10}px`}}>
          <LinkHeader contentName="지출" contentRoute="/spending/monthly"/> 
        </header>
        <main className='mx-auto' style={{height: `${dvh * 80}px`, width: `${dvw * 90}px`}}>
          {/* 전달 대비 지출액 */}
          <div style={{height: '50%'}}>
            <div className="text-left text-2xl m-2">
              <span >9월보다</span>
              <br />
              {lastMonthExpense > previousMonthExpense ? (
                <div className="flex items-center">
                  <Icon path={mdiTriangle} size={1} style={{color: '#465A65'}}></Icon>
                  <span className="font-galmuri-11-bold text-2xl" style={{color: '#465A65'}}>{(lastMonthExpense - previousMonthExpense).toLocaleString()}원</span>
                  &nbsp;
                  <span>늘었어요</span>
                </div>
              ) : (
                <div className="flex">
                  <Icon path={mdiTriangleDown} size={1} style={{color: '#465A65'}}></Icon>
                  <span className="font-galmuri-11-bold text-2xl" style={{color: '#465A65'}}>{(previousMonthExpense - lastMonthExpense).toLocaleString()}원</span>
                  &nbsp;
                  <span>줄었어요</span>
                </div>
              )
              }
            </div>
            <div>
              <MonthlyBarChart chartData={MonthlyExpenses}/>
            </div>
          </div>
          {/* 올해 평균 소비, 월평균 소비, 목표 달성액 */}
          <div style={{height: '50%'}}>
            <div className="bg-[#D9D9D9] border rounded-lg">
              {/* 올해 총 소비 */}
              <div className="flex justify-around my-4">
                <p>올해 총 소비</p>
                <div className="text-right">
                  <p className="font-galmuri-11-bold">※API 연동 필요※만 원</p>
                  <p>목표 소비액 ※API 연동 필요※만 원</p>
                </div>
              </div>
              {/* 월 평균 소비 */}
              <div className="flex justify-around my-4">
                <p>월 평균 소비</p>
                <div className="text-right">
                  <p className="font-galmuri-11-bold">※API 연동 필요※원</p>
                  <p>목표 소비액 ※API 연동 필요※만 원</p>
                </div>
              </div>
              {/* 목표 달성을 위한 조언 */}
              <div className="mb-4">
                <p>목표 달성을 위해 매달</p>
                <p>약 <span className="font-galmuri-11-bold" style={{color: "#C8A1E0"}}>※API 연동 필요※원</span> 이하로 사용해야 합니다.</p>
              </div>
            </div>
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