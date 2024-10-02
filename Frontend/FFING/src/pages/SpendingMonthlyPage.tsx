import React from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiChevronLeft } from '@mdi/js';
import LinkHeader from '../components/Common/LinkHeader'
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import Calendar from 'react-calendar';

const SpendingCategoryPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  // API 연동 필요(변수명 바꾸기)
  const expense = 9123456
  // 구매 기록이 있는 날짜
  const expenses = [
    {date: '2024-10-01', expenditure: 10000, income: 100000},
    {date: '2024-09-25', expenditure: 23000, income: 10000},
    {date: '2024-09-24', expenditure: 1000},
    {date: '2024-09-23', expenditure: 5030},
    {date: '2024-09-18', expenditure: 7000},
    {date: '2024-09-15', expenditure: 100000},
    {date: '2024-09-07', expenditure: 160000},
    {date: '2024-09-01', expenditure: 50000},
    {date: '2024-08-31', expenditure: 17000, income: 100000},
  ] 

  // 달력을 위한 value
  const [value, setValue] = useState(new Date());
  
  // 달력에는 날짜만 표시
  const formatDay = (locale, date) => {
    return date.getDate().toString();
  };

  // 지출이 있는 날짜에 <div class="dot"></div> 추가
  const tileContent = ({ date, view }) => {
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    if (view === 'month') {
      const expense = expenses.find(expense => expense.date === localDate);
      console.log(expense)
      // 지출이 있으면 dot 추가
      if (expense) {
        return (
          <div className="flex flex-col items-center">
            <div className="dot"></div>
            <p className="text-xs">-{expense.expenditure}</p>
            {expense.income && <p className="text-xs">+{expense.income}</p>}
          </div>
        );
      }
    }
  };

  // 이번 달의 마지막 날을 계산
  const lastDayOfMonth = new Date();
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(0);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 메인 화면으로 되돌아가는 링크와 알람 header */}
        <header style={{height: `${dvh * 10}px`}}>
          <LinkHeader contentName="지출" contentRoute="/spending"/> 
        </header>
        <main className='mx-auto'style={{height: `${dvh * 80}px`, width: `${dvw * 90}px`}}>
          {/* 항목 별 지출 라우팅 */}
          <div style={{height: '10%'}} className="flex justify-end items-center">
            {/* <Link to="/spending" style={{color: '#F55322'}} className="flex items-center">
              <Icon path={mdiChevronLeft} size={1} />
              <span>항목 별 지출</span>
            </Link> */}
            {/* 이번 달 소비액 */}
            <p>- {expense.toLocaleString()}원</p>
          </div>
          <div style={{height: '80%'}}>
            <Calendar
              onChange={setValue}
              value={value}
              minDetail="month" // 년 단위 이동 금지
              maxDetail="month" // 년 단위 이동 금지
              showNeighboringMonth={false}  // 다음 달 소비액은 보여주지 않음
              prev2Label={null} // 월 단위로만 넘어갈 수 있게
              next2Label={null} // 월 단위로만 넘어갈 수 있게
              calendarType='gregory'  // 일요일부터 시작
              formatDay={formatDay} // 숫자로만 이루어진 달력
              tileClassName='my-[1%]' // 날짜 사이의 세로 margin 2%
              tileContent={tileContent} // 지출이 있는 날짜에 점 추가
              maxDate={lastDayOfMonth}  // 마지막 날짜는 이번 달 말일
            />
          </div>
          <div className="bg-[#71D7DD] rounded-lg flex justify-center items-center" style={{height: '10%'}}>
            <Link to="analysis">월간 지출 분석</Link>
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