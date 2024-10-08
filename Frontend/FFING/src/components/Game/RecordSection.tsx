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

const RecordSection: React.FC = () => {
  const dvw = useViewportStore((state) => state.dvw);
  const dvh = useViewportStore((state) => state.dvh);
  const petSpriteMetaData = usePetInfoStore((state) => state.petSpriteMetaData);
  const [isModalOpen, setModalOpen] = useState(false); // 모달의 열림 여부를 관리하는 함수
  const [yearMonth, setYearMonth] = useState('202410'); // 초기 연도와 월 설정

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

  // `usePetHistoy`를 최상위 레벨에서 호출
  const { data: petDatas, isLoading } = usePetHistoy('1', yearMonth);

  // 모달을 여는 함수
  const handleCardClick = (pet: petRecordInterface) => {
    setSelectedPet(pet); // 특정 펫 지정
    setModalOpen(true); // 모달 열기
  };

  // 모달을 닫는 함수
  const handleModalClose = () => {
    setModalOpen(false); // 모달 닫기
  };

  // 월 변경 함수
  const changeMonth = (direction: 'prev' | 'next') => {
    const year = parseInt(yearMonth.slice(0, 4));
    const month = parseInt(yearMonth.slice(4, 6));
    let newYear = year;
    let newMonth = month;

    if (direction === 'prev') {
      newMonth -= 1;
      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }
    } else {
      newMonth += 1;
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }
    }

    const newYearMonth = `${newYear}${newMonth.toString().padStart(2, '0')}`; // 새롭게 변경된 yyyymm
    setYearMonth(newYearMonth);
  };

  // 로딩 중일 경우 처리
  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  return (
    <section className="mt-2 pb-20">
      {/* 현재 연도와 달 표시 */}
      <h2 className="text-center text-xl font-semibold text-zinc-400">
        {/* YYYY년 MM월 */}
        <span onClick={() => changeMonth('prev')}>&lt;</span> {`${yearMonth.slice(0, 4)}년 ${yearMonth.slice(4, 6)}월`} <span onClick={() => changeMonth('next')}>&gt;</span>
      </h2> 

      {/* 주차별 획득한 펫 카드들 */}
      {petDatas?.map((pet: petRecordInterface) => (
        <PetRecord
          key={pet.petInfoId}
          week={pet.week}
          petName={pet.petName}
          wins={pet.winCount}
          losses={pet.loseCount}
          petImageUrl={petSpriteMetaData.find((sprite) => sprite.petCode === pet.petCode)?.imageUrl || ''}
          onClick={() => handleCardClick(pet)}  // 클릭시 모달 오픈
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
        petCode={selectedPet.petCode}
        petImageUrl={petSpriteMetaData.find((sprite) => sprite.petCode === selectedPet.petCode)?.imageUrl || ''}
        petTrait={selectedPet.typeName}
        totalStat={selectedPet.totalStat}
        financeStat={selectedPet.financeStat}
        foodBakeryStat={selectedPet.foodBakeryStat}
        lifeCultureStat={selectedPet.lifeCultureStat}
        shoppingStat={selectedPet.shoppingStat}
        transportationStat={selectedPet.transportationStat}
      />
    </section>
  );
};

export default RecordSection;
