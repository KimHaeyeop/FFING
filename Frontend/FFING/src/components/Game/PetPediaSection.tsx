import React from "react";
import PetSprite from "./PetSprite";

const PetPediaSection: React.FC = () => {
  return (
    <section className="mt-8 grid grid-cols-3 gap-4">
      {/* 펫 도감 리스트 - 각 요소는 3개씩 한 행에 배치 */}
      <div className="bg-[#BBBBBB] rounded-lg p-4 flex items-center justify-center">
        {/* 획득한 펫 이미지 추가 위치 */}
        <PetSprite imageUrl="/pets/bear-brown.png"/> 
      </div>
      <div className="bg-[#BBBBBB] rounded-lg p-4 flex items-center justify-center">
        {/* 획득한 펫 이미지 추가 위치 */}
        <PetSprite imageUrl="/pets/bear-lime.png"/> 
      </div>
      <div className="bg-[#BBBBBB] rounded-lg p-4 flex items-center justify-center">
        {/* 획득한 펫 이미지 추가 위치 */}
        <PetSprite imageUrl="/pets/candy-fluff-white.png"/> 
      </div>

      {/* 추가적인 도감 요소가 여기에 들어갈 수 있습니다 */}
    </section>
  );
};

export default PetPediaSection;
