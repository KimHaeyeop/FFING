import React from 'react';
import PetStatusChart from './PetStatusChart'; // 레이더 차트 컴포넌트
import Modal from '../Common/Modal';
import PetSprite from './PetSprite';

interface PetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  petIndex: number; // 이것도 자체적으로 펫 인덱스가 있을 수도 있다.
  petImageUrl: string;
  petTrait: string; // 특성이 여러 개일수도 있어서 배열로 바뀔 수도 있다. 아니면 펫 상세 정보에서 trait도 가지고 있을 수도 있다.
}

const PetDetailModal: React.FC<PetDetailModalProps> = ({
  isOpen,
  onClose,
  petName,
  petIndex,
  petImageUrl,
  petTrait,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* 상단의 둥근 원형 영역 */}
        <div className="w-24 h-24 bg-[#BBBBBB] rounded-full -mt-12 flex justify-center items-center relative z-10">
          <PetSprite imageUrl={petImageUrl} isUnlocked={true}/>
        </div>

        {/* 펫 이름과 도감 인덱스 */}
        <div className="mt-6 flex items-center">
          <h2 className="text-lg font-bold mr-4">{petName}</h2>
          <span className="text-gray-500">No.{petIndex}</span>
        </div>

        {/* 펫 특성 (Chip 형태 속성에 따라서 색상을 바꾸긴 해야 함?) */}
        <div className="mt-2 bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
          {petTrait}
        </div>

        {/* 레이더 차트 (펫 능력치) */}
        <div className="mt-6 w-full">
          <PetStatusChart />
        </div>
      </div>
    </Modal>
  );
};

export default PetDetailModal;
