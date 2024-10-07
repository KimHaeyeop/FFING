import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LinkHeader from "../components/Common/LinkHeader";
import useViewportStore from "../store/useViewportStore";
import NavBar from "../components/Common/Navbar";
import { getTransaction } from '../api/AssetApi';
import DepositSavingCard from "../components/Asset/DepositSavingCard";

interface TransactionInterface {
  transactionId: number
  paymentName: string
  paymentDate: string // YYYYMMDD
  paymentTime: string // HHMMSS
  paymentBalance: number
  totalBalance: number
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
  const { product, key } = useLocation().state as { product: FinancialProductInterface, key: number }; // useNavigate를 통해 가져온 데이터를 사용
  const [ transactions, setTransActions ] = useState<TransactionInterface[]>([]); // 특정 금융 상품의 거래 내역

  // 이번 달 지출액을 가져오는 함수
  const fetchData = async () => {
    try {
      // 실제 사용자 이름으로 진행
      const response = await getTransaction('deposit', '1'); // 타입과 계좌 idx
      setTransActions(response.data.result)
    } catch (error) {
      console.error('Error fetching certain spending data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{height: `${dvh * 10}px`}}>
          {/* 사용자의 정보와 알람 API 연동 필요*/}
          <LinkHeader contentName="예금, 적금" contentRoute="/asset"/> 
        </header>
        <main className='mx-auto' style={{height: `${dvh * 80}px`, width: `${dvw * 90}px`}}>
          {/* 특정 상품을 보여주는 칸 */}
          <DepositSavingCard key={key} product={product} />
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