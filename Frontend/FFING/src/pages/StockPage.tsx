import React, { useEffect, useState } from "react";
import NavBar from "../components/Common/Navbar";
import useViewportStore from "../store/useViewportStore";
import LinkHeader from "../components/Common/LinkHeader";
import { getStocks } from "../api/AssetApi";
import StockDetailCard from "../components/Asset/StockDetailCard";

interface SecuritiesInterface {
  stockAccountId: string,
  securitiesCompanyName: string,
  stockAccountBalance: number,
  totalPLBalance: number,
  totalPLRate: number
}

const StockPage: React.FC<SecuritiesInterface> = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const [securities, setSecurities]= useState<SecuritiesInterface[]>([])
  const [stockAccountIds, setStockAccountIds] = useState<string[]>([]);

  // stocks를 보여주는 security의 accountId 배열을 관리하는 함수
  const handleClick = (accountId: string) => {
    setStockAccountIds(prevState =>
      prevState.includes(accountId)
      ? prevState.filter(id => id !== accountId)  // 제거
      : [...prevState, accountId] // 추가
    );
  };


  // 증권 정보를 가져오는 함수
  const fetchData = async () => {
    try {
      const response = await getStocks('1');
      setSecurities(response.data.result.stockAccountInfos)
    } catch (error) {
      console.error('증권사 별 주식 데이터를 가져오던 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header style={{ height: `${dvh * 10}px` }}>
          {/* assetMain으로 이동 */}
          <LinkHeader contentName="주식" contentRoute="/asset" />
        </header>
        <main className="mx-auto" style={{ height: `${dvh * 80}px`, width: `${dvw * 90}px` }}>
          {/* 증권사 별 정보 */}
          <div className="pb-16">
            {securities ? (
              securities.map((security) => (
                <div key={security.stockAccountId} className="mb-4">
                  {/* 증권사명, 이후에는 svg로 교체 */}
                  <div
                    onClick={() => handleClick(security.stockAccountId)}
                    className="border-2 border-current rounded-lg m-4 flex cursor-pointer"
                  >
                    <div className="m-2">
                      <p>{security.securitiesCompanyName}</p>
                    </div>
                    {/* 증권사 가입 정보 */}
                    <div className="text-lg m-4">
                      <p>현재 보유 주식</p>
                      <p>
                        <span className="font-galmuri-11-bold mt-2">
                          {security.stockAccountBalance.toLocaleString()}
                        </span>
                        원
                      </p>
                      {security.totalPLBalance >= 0 ? (
                        <p className="text-xs text-red-500">
                          {security.totalPLBalance.toLocaleString()}원(
                          {security.totalPLRate.toFixed(2)}%)
                        </p>
                      ) : (
                        <p className="text-xs text-blue-500">
                          {security.totalPLBalance.toLocaleString()}원(
                          {security.totalPLRate.toFixed(2)}%)
                        </p>
                      )}
                    </div>
                  </div>
                  {/* 클릭한 항목만 StockDetailCard 렌더링 */}
                  {stockAccountIds.includes(security.stockAccountId) && (
                    <StockDetailCard stockAccountId={String(security.stockAccountId)} />
                  )}
                </div>
              ))
            ) : (
              <p>증권 가입 정보가 없습니다.</p>
            )}
          </div>
        </main>
        {/* 페이지 이동을 위한 footer */}
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};  

export default StockPage;