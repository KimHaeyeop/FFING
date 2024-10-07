import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import LinkHeader from '../components/Common/LinkHeader'
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import { getCertainDateExpense } from '../api/SpendingApi';
import ExpenseDetail from "../components/Spending/ExpenseDetail";

interface expenseInterface {
  expenseBalance: number,
  expenseCategory: string,
  expenseDate: string,
  expenseId: number,
  expenseMemo: string,
  expenseName: string,
  expenseTime: string,
}

const MainPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const { date } = useLocation().state as { date: string }; // useNavigate를 통해 가져온 데이터를 사용
  const [ expenses, setExpenses ] = useState<expenseInterface[]>([])  // 구매 정보
  const [ dailyTotal, setDailyTotal ] = useState<number>(0) // 일간 사용액
  const [ weeklyTotal, setWeeklyTotal ] = useState<number>(0)  // 주간 총 사용액
  const [ weekRange, setWeekRange ] = useState<string>(''); // 주간 범위 상태 추가
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // 클릭된 날짜 상태

  // 날짜를 'YYYYMMDD' 형식에서 Date 객체로 변환하는 함수
  const formatDateToObject = (dateString: string): Date => {
    return new Date(dateString.slice(0, 4) + '-' + dateString.slice(4, 6) + '-' + dateString.slice(6, 8));
  };

  // 주차 별 지출 내역을 가져오는 함수
  const fetchData = async (today: string) => {
    try {
      const response = await getCertainDateExpense(today);
      setExpenses(response.data.result.expenses); // 
      setWeeklyTotal(response.data.result.weeklyTotal); // 주간 총액 저장
      setDailyTotal(response.data.result.dailyTotal); // 오늘 총액 저장
    } catch (error) {
      console.error('Error fetching certain spending data:', error);
    }
  };
  
  // 날짜 선택 시 호출되는 함수
  const handleDateChange = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
    setSelectedDate(date)  // 선택한 날짜 저장
    fetchData(formattedDate); // 선택한 날짜로 API 호출
  };


  // 오늘 날짜인지 확인하는 함수
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString(); // 간결한 날짜 비교
  };

  // 주차 범위를 문자열로 계산하는 함수
  const calculateWeekRange = (weekDates: Date[]): string => {
    const startOfWeek = weekDates[0];
    const endOfWeek = weekDates[6];
    return `${startOfWeek.getMonth() + 1}월 ${startOfWeek.getDate()}일 ~ ${endOfWeek.getMonth() + 1}월 ${endOfWeek.getDate()}일`;
  };

  // 주간 달력에 필요한 날짜 계산 함수
  const getWeekDates = (date: Date): Date[] => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // 해당 주의 첫 날(일요일)

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  useEffect(() => {
    const weekDates = getWeekDates(formatDateToObject(date));
    setWeekRange(calculateWeekRange(weekDates)); // 주간 범위 설정
    fetchData(date); // 초기 데이터를 가져오기
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{height: `${dvh * 10}px`}}>
          <LinkHeader contentName="지출" contentRoute="/spending/monthly"/> 
        </header>
        <main className='mx-auto'style={{height: `${dvh * 80}px`, width: `${dvw * 90}px`}}>
          {/* 이번 주 날짜 범위와 이번 주 사용액을 나타내는 부분 */}
          <div className="flex justify-between text-lg">
            <p>{weekRange}</p>
            <p>- {weeklyTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}원</p>
          </div>
          {/* 주간 달력을 나타내는 부분 */}
          <div className="grid grid-cols-7 gap-4 my-12">
            {getWeekDates(selectedDate).map((day, index) => (
              // 날짜와 요일
              <div
                key={index}
                // 오늘 날짜 강조
                className={`text-center cursor-pointer 
                  ${isToday(day) ? 'bg-[#FE830A] text-white font-bold' : ''}  
                  ${selectedDate.getTime() === day.getTime() ? 'border-2 border-[#FE830A]' : ''}`}  // 선택된 날짜 강조
                onClick={() => handleDateChange(day)} //날짜를 클릭하면 날짜 정보가 바뀜
              >
                <p>{['일', '월', '화', '수', '목', '금', '토'][index]}</p>
                <p>{day.getDate()}</p>
                <div className="flex flex-col items-center">
                  {/* 지출이 있으면 점을 추가(현재는 주 단위 지출을 고려하기 난해해 구현 보류) */}
                  {expenses.some(expense => {
                    // 'YYYYMMDD' 형식을 'YYYY-MM-DD'로 변환
                    const formattedDate = expense.expenseDate.slice(0, 4) + '-' + expense.expenseDate.slice(4, 6) + '-' + expense.expenseDate.slice(6, 8);
                    const expenseDate = new Date(formattedDate); // 변환된 날짜의 타임스탬프
                      // 연, 월, 일만 비교 (시간 무시)
                    return (
                      expenseDate.getFullYear() === day.getFullYear() &&
                      expenseDate.getMonth() === day.getMonth() &&
                      expenseDate.getDate() === day.getDate()
                    )
                  }) && (
                    <div className="dot"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* 해당 일자의 지출 금액을 보여주는 부분 */}
          {dailyTotal > 0 ? (
            <p className="text-right">- {dailyTotal.toLocaleString()}원</p> // 오늘 지출 내역
          ): (
            <p className="text-center">지출이 없습니다.</p>  // 지출이 없을 때 안내 문구
          )}
          {/* 일자별 지출 내역을 보여주는 부분 */}
          {expenses.map((expense, index) => (
            <ExpenseDetail
              key={index}
              category={expense.expenseCategory}
              title={expense.expenseName}
              date={expense.expenseDate}
              cost={expense.expenseBalance}
            />
          ))}
        </main>
        {/* 페이지 이동을 위한 footer */}
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default MainPage;