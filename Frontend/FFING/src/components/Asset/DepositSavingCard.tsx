import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const bankCodeBgColor: { [key: string]: string } = {
    '001': 'linear-gradient(100deg, #6C64AA 0%, #B6ADF4 100%)',
    '002': 'linear-gradient(100deg, #DD29C3 0%, #FBB18E 100%)',
    '003': 'linear-gradient(100deg, #50AB55 0%, #90E13D 100%)',
  }
  const handleProductClick = (product: FinancialProductInterface) => {
    navigate('/asset/product/detail', { state: { product }})
  }

  return (
    <div
      key={product.accountNo}
      className="flex justify-around items-end rounded-md m-4"
      style={{background: bankCodeBgColor[product.bankCode]}}
      onClick={() => handleProductClick(product)}
    >
      <div className="text-white text-left text-xs m-2">
        <p>{product.accountName}</p>
        <p className="text-lg">{product.totalBalance.toLocaleString()}원</p>
        <p style={{color: '#FFEF60'}}>{product.accountNo}</p>
      </div>
        {/* 원래는 이미지가 들어가야 함 */}
        <p className="m-2">{product.bankCode}</p>
    </div>
    )
};

export default DepositSavingCard;
