import React, { useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import LinkHeader from '../components/Common/LinkHeader'
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import { getMonthlyExpense } from '../api/SpendingApi';


interface dailySummaryInterface {
  date: string,
  totalExpense: number,
  totalIncome: number,
}

const SpendingCategoryPage: React.FC = () => {
  const [dailySummary, setDailySummary] = useState<dailySummaryInterface[]>([]);  // 당월 일자 별 지출액 확인
  const [monthTotalExpense, setMonthTotalExpense] = useState(0) // 이번 달 총 사용 금액
  const [value, setValue] = useState(new Date()); // 달력을 위한 value
  
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);

  // 이번 달(일별) 지출 내역을 가져오는 함수
  const fetchData = async (today: string) => {
    try {
      const response = await getMonthlyExpense(today);  // 캘린더의 일자에 따라 값 가져오기
      console.log(response.data.result.dailySummary);
      setMonthTotalExpense(response.data.result['totalExpense'])  // 이번 달 총 사용 금액 저장
      setDailySummary(response.data.result.dailySummary); // 데이터를 일자 별 지출액 확인
    } catch (error) {
      console.error('Error fetching spending data:', error);
    }
  };

  // 달력에는 날짜만 표시
  const formatDay = (locale: string, date: Date) => {
    return date.getDate().toString();
  };

  // 지출이 있는 날짜에 <div class="dot"></div> 추가
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
    .toISOString().split('T')[0]  // 'YYYY-MM-DD' 형식으로 변경
    .replace(/-/g, ''); // '-' 제거
    if (view === 'month') {
      const expense = dailySummary.find(expense => expense.date === localDate);
      // 지출이 있으면 dot 추가
      if (expense && (expense.totalExpense > 0 || expense.totalIncome > 0)) {
        return (
          <div className="flex flex-col items-center">
            <div className="dot"></div>
            {/* 지출이 0보다 크면 렌더링 */}
            {expense.totalExpense > 0 && <p className="text-xs">-{expense.totalExpense}</p>}  
            {/* 수입이 0보다 크면 렌더링 */}
            {expense.totalIncome > 0 && <p className="text-xs">+{expense.totalIncome}</p>}
          </div>
        );
      }
    }
  };

  // 달력이 바뀌었을 때 API를 호출하기 위해 바뀐 연/월을 가져오는 함수
  const handleActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date }) => {
    const year = activeStartDate.getFullYear();
    const month = (activeStartDate.getMonth() + 1).toString().padStart(2, '0'); // 월을 두 자리 숫자로 포맷팅
    const formattedDate = `${year}${month}`;
    fetchData(formattedDate)  // API 호출 시 필요한 날짜 형식 전달
  };

  // 이번 달의 마지막 날을 계산
  const lastDayOfMonth = new Date();
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '').slice(0, 6);
    fetchData(today);
  }, []);

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
            {/* 이번 달 소비액 */}
            <p>{monthTotalExpense.toLocaleString()}원</p>
          </div>
          {/* 달력 컴포넌트 */}
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
              onActiveStartDateChange={handleActiveStartDateChange} // 월 변경 시 이벤트 처리
            />
          </div>
          {/* 지출 분석 버튼 */}
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