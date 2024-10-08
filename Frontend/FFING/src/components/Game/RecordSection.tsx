import React, { useState } from "react";
import useViewportStore from "../../store/useViewportStore";  
import usePetInfoStore from "../../store/usePetInfoStore";  // 전체 펫의 정보를 저장하고 있는 store
import PetDetailModal from "./PetDetailModal";  // 펫의 상세 정보를 보여주는 모달
import PetRecord from "./PetRecord";  // 펫의 기록을 보여주는 컴포넌트
import { usePetHistoy } from "../../hook/usePetHistory";  // 펫 기록을 관리

interface petRecordInterface {
  petInfoId: number,
  totalStat: number,
  financeStat: number,
  foodBakeryStat: number,
  lifeCultureStat: number,
  shoppingStat: number,
  transportationStat: number,
  winCount: number,
  loseCount: number,
  petCode: string,
  petName: string,
  typeCode: string,
  typeName: string,
  yearMonth: string,
  week: number,
}

interface petRecordProps {
  petDatas: petRecordInterface[];  // petDatas 속성을 정의
}

const RecordSection: React.FC<petRecordProps> = ({ petDatas }) => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const petSpriteMetaData = usePetInfoStore((state) => state.petSpriteMetaData)
  usePetHistoy('1', '202409'); // (유저ID, yyyymm)
  const [isModalOpen, setModalOpen] = useState(false); // 모달의 열림 여부를 관리하는 함수

  // 모달에 띄울 데이터를 관리
  const [selectedPet, setSelectedPet] = useState<petRecordInterface>({
    petInfoId: 0,
    totalStat: 0,
    financeStat: 0,
    foodBakeryStat: 0,
    lifeCultureStat: 0,
    shoppingStat: 0,
    transportationStat: 0,
    winCount: 0,
    loseCount: 0,
    petCode: '',
    petName: '',
    typeCode: '',
    typeName: '',
    yearMonth: '',
    week: 0,
  });

  // 모달을 여는 함수
  const handleCardClick = (pet: petRecordInterface) => {
    setSelectedPet(pet) // 특정 펫 지정
    setModalOpen(true)  // 모달 열기
  }

  // 모달을 닫는 함수
  const handleModalClose = (() => {
    setModalOpen(false) // 모달 닫기
  })
  
  return (
    <section className="mt-2 pb-20">
      {/* 현재 연도와 달 표시 (ex: 2024년 9월) API 활용 불가피? */}
      <h2 className="text-center text-xl font-semibold text-zinc-400">&lt; 2024년 9월 &gt;</h2> 

        {/* 주차별 획득한 펫 카드들 */}
          {petDatas.map(pet => (
            <PetRecord
              key={pet.petInfoId}
              week={pet.week}
              petName={pet.petName}
              wins={pet.winCount}
              losses={pet.loseCount}
              petImageUrl={petSpriteMetaData.find((sprite) => sprite.petCode === pet.petCode)?.imageUrl || ''}
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
        petCode={selectedPet.petCode}  // 예시로 No.1
        petImageUrl={petSpriteMetaData.find((sprite) => sprite.petCode === selectedPet.petCode)?.imageUrl || ''}
        petTrait={selectedPet.typeName}  // 예시로 food 특성
    />
    </section>
  );
};

export default RecordSection;
