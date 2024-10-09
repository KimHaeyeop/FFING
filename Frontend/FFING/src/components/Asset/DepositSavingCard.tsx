import React from 'react';
import { useNavigate } from 'react-router-dom';
import useFinanceFirmCodeStore from '../../store/useFinanceFirmCodeStore';

interface FinancialProductInterface {
  accountId: number;
  accountName: string;
  accountNo: string;
  bankCode: string;
  totalBalance: number;
  type: string;
}

interface DepositSavingCardProps {
  product: FinancialProductInterface;
}

const DepositSavingCard: React.FC<DepositSavingCardProps> = ({ product }) => {
  const {financeFirmMetaData, setFinancialProducts} = useFinanceFirmCodeStore() // 금융 회사 코드의 배경과 이미지를 가지고 있는 저장소
  const navigate = useNavigate();

  // 상품 상세 정보로 전달하는 함수
  const handleProductClick = (product: FinancialProductInterface) => {
    navigate('/asset/product/detail', { state: { product }})
  }

  return (
    <div
      key={product.accountNo}
      className="flex justify-around items-end rounded-md m-4"
      style={{background: financeFirmMetaData[product.bankCode].background}}
      onClick={() => handleProductClick(product)}
    >
      <div className="text-white text-left text-xs m-2">
        <p>{product.accountName}</p>
        <p className="text-lg">{product.totalBalance.toLocaleString()}원</p>
        <p style={{color: '#FFEF60'}}>{product.accountNo}</p>
      </div>
        {/* 원래는 이미지가 들어가야 함 */}
        <img src={financeFirmMetaData[product.bankCode].logoUrl} alt="" className='m-2 w-1/4 h-1/4'/>
    </div>
    )
};

export default DepositSavingCard;
