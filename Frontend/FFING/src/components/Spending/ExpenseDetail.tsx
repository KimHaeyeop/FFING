import React from "react";
import {
  mdiFood,
  mdiTrainCar,
  mdiShopping,
  mdiSofaSingleOutline,
  mdiCashMultiple,
  mdiBikePedalMountain,
} from "@mdi/js";
import Icon from "@mdi/react";

interface ExpenseDetailProps {
  category: string; // 항목
  title: string; // 구매 제목
  date: string; // 사용 일자
  cost: number; // 사용 비용
}

const ExpenseDetail: React.FC<ExpenseDetailProps> = ({
  category,
  title,
  date,
  cost,
}) => {
  const categoryIconMap: { [key: string]: string } = {
    FOOD_BAKERY: mdiFood,
    TRANSPORTATION: mdiTrainCar,
    SHOPPING: mdiShopping,
    LIFE_CULTURE: mdiSofaSingleOutline,
    FINANCE: mdiCashMultiple,
    OVERSEAS: mdiBikePedalMountain, // 오류 대비
  };

  return (
    <>
      <hr className="border-1 border-black" />
      <div className="flex justify-between items-center m-4">
        {/* 왼편 아이콘과 타이틀 */}
        <div className="flex items-center">
          <Icon path={categoryIconMap[category]} size={1} />
          <div className="ml-4 text-left">
            <p className="font-bold">{title}</p>
            <p className="mt-2 text-gray-500 text-sm">{date}</p>
          </div>
        </div>
        {/* 오른편 비용 */}
        <div>
          <p className="font-bold">
            -{cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}원
          </p>
        </div>
      </div>
    </>
  );
};

export default ExpenseDetail;
