import React from 'react';
import { mdiFood, mdiTrainCar, mdiShopping, mdiSofaSingleOutline, mdiCashMultiple } from '@mdi/js';
import Icon from '@mdi/react';

interface ExpenseDetailProps {
  category: string;         // 항목
  title: string;      // 구매 제목
  date: string;         // 사용 일자
  cost: number;       // 사용 비용
}

const ExpenseDetail: React.FC<ExpenseDetailProps> = ({ category, title, date, cost }) => {
  const categoryIconMap = {
    '식비': mdiFood,
    '교통': mdiTrainCar,
    '쇼핑': mdiShopping,
    '생활/문화': mdiSofaSingleOutline,
    '금융': mdiCashMultiple,
  };

  return (
    <>
      <div className="flex justify-between items-center m-4">
        {/* 왼편 아이콘과 타이틀 */}
        <div className="flex items-center">
          <Icon path={categoryIconMap[category]} size={1} />
          <div className="ml-4 text-left">
            <p className="font-bold">{title}</p>
            <p className="mt-2 ml-4 text-gray-500 text-sm">{date}</p>
          </div>
        </div>
        {/* 오른편 비용 */}
        <div>
          <p className="font-bold">-{cost.toLocaleString()}원</p>
        </div>
      </div>
      <hr className='border-1 border-black'/>
    </>
  );
};

export default ExpenseDetail;
