import React, { useState } from "react";
import PetDetailModal from "./PetDetailModal";
import PetRecord from "./PetRecord";

interface petRecords {
  week: string;
  petName: string;
  petIndex: number;
  wins: number;
  losses: number;
  petImageUrl: string;
  petTrait: string;
}

const RecordSection: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  // 모달에 띄울 데이터를 관리
  const [selectedPet, setSelectedPet] = useState({
    petName: '',
    petIndex: 0,
    petImageUrl: '',
    petTrait: ''
  });

  // 주차별 데이터 (API 완성되면 가져오기)
  const petRecords = [
    { week: '9월 1주차', petName: 'bear-brown', wins: 10, losses: 3, petImageUrl: '/pets/bear-brown.png', petIndex: 1, petTrait: 'food' },
    { week: '9월 2주차', petName: 'bear-lime', wins: 8, losses: 5, petImageUrl: '/pets/bear-lime.png', petIndex: 2, petTrait: 'living' },
    { week: '9월 3주차', petName: 'candy-fluff-white', wins: 6, losses: 7, petImageUrl: '/pets/candy-fluff-white.png', petIndex: 3, petTrait: 'travel' },
    // 더 많은 주차 데이터 추가 가능
  ];

  // 모달을 여는 함수
  const handleCardClick = (pet: petRecords) => {
    setSelectedPet(pet)
    setModalOpen(true)
  }

  // 모달을 닫는 함수
  const handleModalClose = (() => {
    setModalOpen(false)
  })
  
  return (
    <section className="mt-8">
      {/* 현재 연도와 달 표시 (ex: 2024년 9월) API 활용 불가피? */}
      <h2 className="text-center text-xl font-semibold">2024년 9월</h2>

        {/* 주차별 획득한 펫 카드들 */}
        {petRecords.map((pet, index) => (
          <PetRecord
            key={index}
            week={pet.week}
            petName={pet.petName}
            wins={pet.wins}
            losses={pet.losses}
            petImageUrl={pet.petImageUrl}
            onClick={() => handleCardClick(pet)}
          />
        ))}
      {/* 펫 상세 정보 모달 */}
      <PetDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        petName={selectedPet.petName}
        petIndex={selectedPet.petIndex}  // 예시로 No.1
        petImageUrl={selectedPet.petImageUrl}
        petTrait={selectedPet.petTrait}  // 예시로 food 특성
      />
    </section>
  );
};

export default RecordSection;
