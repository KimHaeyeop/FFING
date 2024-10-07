import React, { useState } from "react";
import PetDetailModal from "./PetDetailModal";
import PetRecord from "./PetRecord";
import useViewportStore from "../../store/useViewportStore";

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
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh); 
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
    { week: '9월 1주차', petName: 'bear-brown', wins: 10, losses: 3, petImageUrl: '/pets/bear-brown.png', petIndex: 1, petTrait: '외식' },
    { week: '9월 2주차', petName: 'bear-lime', wins: 8, losses: 5, petImageUrl: '/pets/bear-lime.png', petIndex: 2, petTrait: '생활/문화' },
    { week: '9월 3주차', petName: 'candy-fluff-white', wins: 6, losses: 7, petImageUrl: '/pets/candy-fluff-white.png', petIndex: 3, petTrait: '여행' },
    { week: '9월 4주차', petName: 'candy-fluff-yellow', wins: 6, losses: 7, petImageUrl: '/pets/candy-fluff-yellow.png', petIndex: 4, petTrait: '교통' },
    { week: '9월 5주차', petName: 'cat-black', wins: 6, losses: 7, petImageUrl: '/pets/cat-black.png', petIndex: 5, petTrait: '금융' },
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
    <section className="mt-2 pb-20">
      {/* 현재 연도와 달 표시 (ex: 2024년 9월) API 활용 불가피? */}
      <h2 className="text-center text-xl font-semibold text-zinc-400">&lt; 2024년 9월 &gt;</h2> 

        {/* 주차별 획득한 펫 카드들 */}
          {petRecords.map((pet, index) => (
            <PetRecord
              key={index}
              week={pet.week}
              petName={pet.petName}
              wins={pet.wins}
              losses={pet.losses}
              petImageUrl={pet.petImageUrl}
              onClick={() => handleCardClick(pet)}  // 클릭시 모달 오픈
              // 화면 크기에 따른 카드의 너비와 높이 조정
              style={{
                width: `${80 * dvw}px`,  // 카드 너비를 뷰포트 너비의 30%로 설정
                height: `${20 * dvh}px`,  // 카드 높이를 뷰포트 높이의 20%로 설정
              }}
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
