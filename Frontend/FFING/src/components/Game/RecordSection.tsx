import React from "react";
import PetSprite from "./PetSprite";

const RecordSection: React.FC = () => {
  return (
    <section className="mt-8">
      {/* 현재 연도와 달 표시 (ex: 2024년 9월) */}
      <h2 className="text-center text-xl font-semibold">2024년 9월</h2>

      {/* 주차별 획득한 펫 카드 컴포넌트 */}
      <div className="mt-4 mx-auto bg-[#ECF1F3] rounded-lg w-[277px] h-[111.91px] flex items-center justify-between px-4">
        <div className="text-left">
          <p>9월 1주차</p>
          <p className="text-lg font-semibold">펫 이름</p>
          <div className="flex space-x-2 mt-1">
            <span className="bg-[#C8E697] text-black py-1 px-3 rounded-full">10승</span>
            <span className="bg-[#D23B8C] text-white py-1 px-3 rounded-full">3패</span>
          </div>
        </div>
        <div className="bg-[#919AA2] rounded-lg w-20 h-20 flex items-center justify-center">
          {/* 펫 이미지 추가 위치 */}
          <PetSprite imageUrl="/pets/bear-brown.png"/> 
          {/* <img src={petImage} alt="펫 이미지" /> */}
        </div>
      </div>

      {/* 추가적인 주차별 기록이 여기에 들어갈 수 있습니다 */}
    </section>
  );
};

export default RecordSection;
