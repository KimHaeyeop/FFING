import React from 'react';
import PetSprite from "./PetSprite";

interface PetCardProps {
  week: string;         // 예: '9월 1주차'
  petName: string;      // 펫 이름
  wins: number;         // 승리 횟수
  losses: number;       // 패배 횟수
  petImageUrl: string;  // 펫 이미지 경로
  onClick: () => void;  // 클릭 핸들러
}

const PetRecord: React.FC<PetCardProps> = ({ week, petName, wins, losses, petImageUrl, onClick }) => {
  return (
    <div
      className="mt-4 mx-auto bg-[#ECF1F3] rounded-lg w-[277px] h-[111.91px] flex items-center justify-between px-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="text-left">
        <h3 className="text-lg font-semibold">{week}</h3>
        <p>{petName}</p>
        <div className="flex space-x-2 mt-1">
          <span className="bg-[#C8E697] text-black py-1 px-3 rounded-full">{wins}승</span>
          <span className="bg-[#D23B8C] text-white py-1 px-3 rounded-full">{losses}패</span>
        </div>
      </div>
      <div className="bg-[#919AA2] rounded-lg w-20 h-20 flex items-center justify-center">
        {/* 펫 이미지 */}
        <PetSprite imageUrl={petImageUrl} isUnlocked={true}/>
      </div>
    </div>
  );
};

export default PetRecord;
