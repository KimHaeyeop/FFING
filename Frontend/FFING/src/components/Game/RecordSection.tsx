import React, { useState } from "react";
import PetDetailModal from "./PetDetailModal";
import PetRecord from "./PetRecord";

interface petRecords {
  week: string;
  name: string;
  wins: number;
  losses: number;
  imageUrl: string;
  index: number;
  trait: string;
}

const RecordSection: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState({
    name: '',
    imageUrl: '',
    index: 0,
    trait: ''
  });

  // 주차별 데이터
  const petRecords = [
    { week: '9월 1주차', name: 'bear-brown', wins: 10, losses: 3, imageUrl: '/pets/bear-brown.png', index: 1, trait: 'food' },
    { week: '9월 2주차', name: 'bear-lime', wins: 8, losses: 5, imageUrl: '/pets/bear-lime.png', index: 2, trait: 'living' },
    { week: '9월 3주차', name: 'candy-fluff-white', wins: 6, losses: 7, imageUrl: '/pets/candy-fluff-white.png', index: 3, trait: 'travel' },
    // 더 많은 주차 데이터 추가 가능
  ];

  const handleCardClick = (pet: petRecords) => {
    setSelectedPet(pet) // 보여줄 데이터
    setModalOpen(true)
  }

  const handleModalClose = (() => {
    setModalOpen(false)
  })
  
  return (
    <section className="mt-8">
      {/* 현재 연도와 달 표시 (ex: 2024년 9월) */}
      <h2 className="text-center text-xl font-semibold">2024년 9월</h2>

        {/* 주차별 획득한 펫 카드들 */}
        {petRecords.map((pet, index) => (
          <PetRecord
            key={index}
            week={pet.week}
            name={pet.name}
            wins={pet.wins}
            losses={pet.losses}
            imageUrl={pet.imageUrl}
            onClick={() => handleCardClick(pet)}
          />
        ))}
      {/* 펫 상세 정보 모달 */}
      <PetDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        name={selectedPet.name}
        index={selectedPet.index}
        imageUrl={selectedPet.imageUrl}
        trait={selectedPet.trait}
      />
    </section>
  );
};

export default RecordSection;
