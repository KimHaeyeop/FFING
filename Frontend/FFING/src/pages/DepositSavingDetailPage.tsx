import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";
import LinkHeader from "../components/Common/LinkHeader";
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
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const { product } = useLocation().state as { product: FinancialProductInterface }; // useNavigate를 통해 가져온 데이터를 사용
  const [ transactions, setTransactions ] = useState<TransactionInterface[]>([]); // 거래 내역
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionInterface[]>([]); // 필터된 거래 내역
  const [filter, setFilter] = useState<string | null>(null); // 필터 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 열림 여부

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
        <header style={{height: `${dvh * 10}px`}}>
          {/* 사용자의 정보와 알람 API 연동 필요*/}
          <LinkHeader contentName={product.accountName} contentRoute="/asset"/> 
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