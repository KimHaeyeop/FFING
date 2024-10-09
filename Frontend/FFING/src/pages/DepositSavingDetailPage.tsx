import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiBell, mdiChevronLeft } from "@mdi/js";
import useViewportStore from "../store/useViewportStore";
import NavBar from "../components/Common/Navbar";
import { getDsTransaction, getAcTransaction } from '../api/AssetApi';
import DepositSavingCard from "../components/Asset/DepositSavingCard";

interface TransactionInterface {
  transactionId: number
  paymentName: string // 입금, 출금 
  paymentDate: string // YYYYMMDD
  paymentTime: string // HHMMSS
  paymentBalance: number
  totalBalance: number
  paymentType: string | null // 입출금 계좌만 존재함
  paymentMemo: string | null // 입출금 계좌만 존재함
  depositInstallment: number | null // 적금 계좌만 존재함
}

interface FinancialProductInterface {
  accountId: number;
  accountName: string;
  accountNo: string;
  bankCode: string;
  totalBalance: number;
  type: string;
}

const DepositSavingDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const { product } = useLocation().state as { product: FinancialProductInterface }; // useNavigate를 통해 가져온 데이터를 사용
  const [ transactions, setTransactions ] = useState<TransactionInterface[]>([]); // 거래 내역
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionInterface[]>([]); // 필터된 거래 내역
  const [filter, setFilter] = useState<string | null>(null); // 필터 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 열림 여부
  const productAccountName = product.accountName
  // 기본적으로 보지 않은 알림이 있다고 가정
  const hasUnreadNotifications = true; // 여기에 실제 알림 확인 로직을 추가해야 함

  // 이번 달 지출액을 가져오는 함수
  const fetchData = async () => {
    try {
      if (product.type === undefined) {
        const response = await getAcTransaction(String(product.accountId)); // 입출금
        setTransactions(response.data.result)
        setFilteredTransactions(response.data.result); // 초기에는 모든 거래 내역 표시
      } else {
        const response = await getDsTransaction(product.type, String(product.accountId)); // 예/적금 
        setTransactions(response.data.result)
        setFilteredTransactions(response.data.result); // 초기에는 모든 거래 내역 표시
      }
    } catch (error) {
      console.error('Error fetching certain spending data:', error);
    }
  };

  // 필터링하는 함수
  const handleFilterChange = (type: string | null) => {
    setFilter(type);
    if (type) {
      setFilteredTransactions(transactions.filter((t) => t.paymentType === type));
    } else {
      setFilteredTransactions(transactions); // 필터가 없으면 모든 거래 내역 표시
    }
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 상단 헤더 */}
        <header style={{height: `${dvh * 10}px`}}>
          <div className='flex justify-between p-3 items-center'>
            {/* 컨텐츠 메뉴 이름은 삭제 */}
              <p onClick={() => navigate('/asset/product', { state: { productAccountName }})} className='flex items-center'>
                <Icon path={mdiChevronLeft} size={2} />
              </p>
            <div style={{ position: 'relative' }}> {/* 아이콘 위치 설정 */}
              {/* 종 아이콘 알람 페이지로 연결 */}
              <Icon path={mdiBell} size={1.5} /> 
              {hasUnreadNotifications && ( // 보지 않은 알림이 있을 경우 점 표시
                <span style={{ 
                  position: 'absolute',
                  top: '-1px',
                  right: '-1px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#D8B9C3',
                  borderRadius: '50%'
                }} />
              )}
            </div>
          </div>
        </header>
        <main className='mx-auto' style={{height: `${dvh * 80}px`, width: `${dvw * 90}px`}}>
          {/* 특정 상품을 보여주는 칸 */}
          <div>
            <DepositSavingCard product={product} />
          </div>
          {/* 거래 내역 필터링 영역 */}
          {product.type === undefined && (
            <div className="relative flex m-4">
              {/* 필터 값이 있으면 입금, 출근, 없으면 전체 */}
              <div className="flex cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <Icon path={mdiChevronDown} size={1} />
                <p>{filter ? (filter === '입금' ? '입금' : '출금') : '전체'}</p>
              </div>
              {/* 드롭다운 */}
              {isDropdownOpen && (
                <div className="absolute mt-8 bg-white border">
                  <p className="cursor-pointer" onClick={() => handleFilterChange(null)}>
                    전체
                  </p>
                  <p className="cursor-pointer" onClick={() => handleFilterChange('입금')}>
                    입금
                  </p>
                  <p className="cursor-pointer" onClick={() => handleFilterChange('출금')}>
                    출금
                  </p>
                </div>
              )}
            </div>
          )}
          {/* 거래 내역을 보여주는 영역 */}
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div key={transaction.transactionId} className="flex justify-around items-center">
                {/* 거래 이름 */}
                <div className="text-lg text-left my-4">
                  <p>{transaction.paymentName}</p>
                  {/* 거래 일시 */}
                  <p className="text-sm mt-2 text-gray-500">
                    <span>{`${transaction.paymentDate.slice(0, 4)}-${transaction.paymentDate.slice(4, 6)}-${transaction.paymentDate.slice(6, 8)}`}</span>
                    &nbsp;
                    <span>{`${transaction.paymentTime.slice(0, 2)}:${transaction.paymentTime.slice(2, 4)}:${transaction.paymentTime.slice(4, 6)}`}</span>
                  </p>
                </div>
                {/* 금액 */}
                <div>
                  <p>{transaction.paymentBalance.toLocaleString()}원</p>
                </div>
              </div>
            ))
          ) : (
            <p>거래 내역이 존재하지 않습니다.</p>
          )}
        </main>
        {/* 페이지 이동을 위한 footer */}
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default DepositSavingDetailPage;