import React, { useEffect, useState } from 'react';
import { getStockDetail } from "../../api/AssetApi";

interface StockAccountIdProps {
  stockAccountId: string
}

interface StockDetailInterface {
  stockAccountId: string,
  stockCode: number,
  stockName: string,
  totalPLBalance: number,
  totalPLRate: number,
  totalStockQuantity: number,
  totalSumEvaluationAmount: number,
  totalSumPurchaseAmount: number
}

const StockDetailCard: React.FC<StockAccountIdProps> = ({ stockAccountId }) => {
  const [stocks, setStocks] = useState<StockDetailInterface[]>([]);

  // 증권 정보를 가져오는 함수
  const fetchData = async (id: string) => {
    try {
      const response = await getStockDetail('1', id); // 첫 번째 인자는 유저 api 획득 후 수행
      setStocks(response.data.result.stockAccountSCInfos)
    } catch (error) {
      console.error('주식 데이터를 가져오던 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchData(stockAccountId);
  }, [stockAccountId]);


  return (
    <div>
      {stocks ? (
        stocks.map(stock => {
          return (
            <div key={stock.stockAccountId} className='rounded-lg m-4 p-2' style={{ backgroundColor: '#F3F5F6' }}>
              {/* 종목명 ,코드 */}
              <div className='flex items-center'>
                <p className='font-galmuri-11-bold'>{stock.stockName}</p>
                <p className='text-xs ml-2'>{stock.stockCode}</p>
              </div>
              <div className='flex justify-between items-center'>
                {/* 평가 금액 */}
                <div className='text-left text-sm'>
                  <p>평가 금액</p>
                  <p>수익률</p>
                </div>
                {/* 수익률 */}
                <div className='text-right text-xs'>
                  <p>KRW {stock.totalSumPurchaseAmount.toLocaleString()}</p>
                  {stock.totalPLBalance >= 0 ? (
                        <p className="text-xs text-red-500">{stock.totalPLBalance.toLocaleString()}원({stock.totalPLRate.toFixed(2)}%)</p>
                      ) : (
                        <p className="text-xs text-blue-500">{stock.totalPLBalance.toLocaleString()}원({stock.totalPLRate.toFixed(2)}%)</p>
                      )
                    }
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <p>증권 가입 정보가 없습니다.</p>
      )}
    </div>
  )
};

export default StockDetailCard;
