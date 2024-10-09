import React, { useEffect, useState } from "react";
import PetSprite from "./PetSprite";
import { getPetHistroy } from "../../api/PetPediaApi";
import usePetInfoStore from "../../store/usePetInfoStore";  // 펫 상태 정보
import { getCurrentYearMonth } from '../../utils/dataUtils'
import { useAuthStore } from "../../store/authStore";

// petPediaPage에서 받아온 props
interface PetPediaSectionProps {
  obtainPets: ObtainPetsInterFace[];
}

interface ObtainPetsInterFace {
  petCollectionId: number;  // 기본키
  petCode: string;  // 펫 코드
  petName: string;  // 펫 이름
  createdDate: string;  // YYYYMMDD
}

const PetPediaSection: React.FC<PetPediaSectionProps> = ({ obtainPets }) => {
  const petSpriteMetaData = usePetInfoStore((state) => state.petSpriteMetaData) // 펫의 정보가 담긴 메타데이터

  // 펫을 획득한 적이 있는지 여부를 확인하는 함수
  const isPetUnlocked = (petCode: string) => {
    return obtainPets.some(pet => pet.petCode === petCode);
  };

  return (
    <div className="rounded pb-20">
      <section className="m-2 grid grid-cols-3 gap-2">
        {/* 펫 도감 리스트 - 각 요소는 3개씩 한 행에 배치 */}
        {petSpriteMetaData.map((pet, index) => (
          <div key={index} className="bg-stone-300 rounded-lg p-4 flex items-center justify-center">
            {/* 획득한 펫 이미지에 isUnlocked 값을 전달 */}
            <PetSprite imageUrl={pet.imageUrl} isUnlocked={isPetUnlocked(pet.petCode)} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default PetPediaSection;
