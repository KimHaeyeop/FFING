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

const SpendingWeeklyPage: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const { date } = useLocation().state as { date: string }; // useNavigate로 전달된 날짜
  const [expenses, setExpenses] = useState<expenseInterface[]>([]);  // 지출 정보
  const [dailyTotal, setDailyTotal] = useState<number>(0); // 일간 사용 금액
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);  // 주간 총 사용 금액
  const [weekRange, setWeekRange] = useState<string>(''); // 주간 범위 표시
  
  // 날짜를 'YYYYMMDD' 형식에서 Date 객체로 변환하는 함수
  const formatDateToObject = (dateString: string): Date => {
    return new Date(dateString.slice(0, 4) + '-' + dateString.slice(4, 6) + '-' + dateString.slice(6, 8));
  };
  
  const [selectedDate, setSelectedDate] = useState<Date>(formatDateToObject(date)); // 선택한 날짜

  // 특정 날짜에 대한 지출 내역을 가져오는 함수
  const fetchData = async (today: string) => {
    try {
      const response = await getCertainDateExpense(today);
      setExpenses(response.data.result.expenses);  // 지출 내역 업데이트
      setWeeklyTotal(response.data.result.weeklyTotal);  // 주간 총액 업데이트
      setDailyTotal(response.data.result.dailyTotal);  // 일간 총액 업데이트
    } catch (error) {
      console.error('지출 데이터를 불러오는 도중 오류 발생:', error);
    }
  };

  // 날짜를 클릭하면 호출되는 함수
  const handleDateChange = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
    setSelectedDate(date);  // 선택한 날짜 업데이트
    fetchData(formattedDate); // 선택한 날짜로 API 호출
  };

  // 오늘 날짜인지 확인하는 함수
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();  // 오늘 날짜 확인
  };

  // 주간 범위를 계산하는 함수
  const calculateWeekRange = (weekDates: Date[]): string => {
    const startOfWeek = weekDates[0];
    const endOfWeek = weekDates[6];
    return `${startOfWeek.getMonth() + 1}월 ${startOfWeek.getDate()}일 ~ ${endOfWeek.getMonth() + 1}월 ${endOfWeek.getDate()}일`;
  };

  // 주간 달력에 필요한 날짜를 계산하는 함수
  const getWeekDates = (date: Date): Date[] => {
    const startOfWeek = new Date(date);  // 날짜 객체 복사
    startOfWeek.setDate(date.getDate() - date.getDay());  // 해당 주의 일요일 계산
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  useEffect(() => {
    const weekDates = getWeekDates(selectedDate);  // 주간 날짜 계산
    setWeekRange(calculateWeekRange(weekDates));  // 주간 범위 설정
    fetchData(selectedDate.toISOString().split('T')[0].replace(/-/g, ''));  // 초기 데이터 불러오기
  }, [selectedDate]);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{ height: `${dvh * 10}px` }}>
          <LinkHeader contentName="지출" contentRoute="/spending/monthly" />
        </header>
        <main className='mx-auto' style={{ height: `${dvh * 80}px`, width: `${dvw * 90}px` }}>
          {/* 이번 주 날짜 범위와 이번 주 사용액을 나타내는 부분 */}
          <div className="flex justify-between text-lg">
            <p>{weekRange}</p>
            <p>- {weeklyTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}원</p>
          </div>
          {/* 주간 달력을 나타내는 부분 */}
          <div className="grid grid-cols-7 gap-4 my-12">
            {getWeekDates(selectedDate).map((day, index) => (
              <div
                key={index}
                className={`text-center cursor-pointer 
                  ${isToday(day) ? 'bg-[#FE830A] text-white font-bold' : ''}  
                  ${selectedDate.getTime() === day.getTime() ? 'border-2 border-[#FE830A]' : ''}`}  // 선택된 날짜 강조
                onClick={() => handleDateChange(day)}  // 날짜 선택 시 이벤트 호출
              >
                <p>{['일', '월', '화', '수', '목', '금', '토'][index]}</p>
                <p>{day.getDate()}</p>
                <div className="flex flex-col items-center">
                  {/* 지출이 있는 날짜에 점 표시 */}
                  {expenses.some(expense => {
                    const expenseDate = new Date(
                      `${expense.expenseDate.slice(0, 4)}-${expense.expenseDate.slice(4, 6)}-${expense.expenseDate.slice(6, 8)}`
                    );
                    return (
                      expenseDate.getFullYear() === day.getFullYear() &&
                      expenseDate.getMonth() === day.getMonth() &&
                      expenseDate.getDate() === day.getDate()
                    );
                  }) && (
                    <div className="dot"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* 선택된 일자의 지출 금액을 표시하는 부분 */}
          {dailyTotal > 0 ? (
            <p className="text-right">- {dailyTotal.toLocaleString()}원</p>
          ) : (
            <p className="text-center">지출이 없습니다.</p>
          )}
          {/* 일자별 지출 내역을 표시하는 부분 */}
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
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default SpendingWeeklyPage;
