import React, { useState } from "react";
import PetSprite from "./PetSprite";
import PetDetailModal from "./PetDetailModal";

const RecordSection: React.FC = () => {
  const petSpriteMetaData = [
    {name: 'bear-brown', imageUrl: '/pets/bear-brown.png'},
    {name: 'bear-lime', imageUrl: '/pets/bear-lime.png'},
    {name: 'candy-fluff-white', imageUrl: '/pets/candy-fluff-white.png'},
    {name: 'candy-fluff-yellow', imageUrl: '/pets/candy-fluff-yellow.png'},
    {name: 'cat-black', imageUrl: '/pets/cat-black.png'},
    {name: 'cat-blue', imageUrl: '/pets/cat-blue.png'},
    {name: 'cat-cyan', imageUrl: '/pets/cat-cyan.png'},
    {name: 'cat-green', imageUrl: '/pets/cat-green.png'},
    {name: 'cat-pink', imageUrl: '/pets/cat-pink.png'},
    {name: 'cat-red', imageUrl: '/pets/cat-red.png'},
    {name: 'cat-violet', imageUrl: '/pets/cat-violet.png'},
    {name: 'cat-yellow', imageUrl: '/pets/cat-yellow.png'},
    {name: 'chiikawa', imageUrl: '/pets/chiikawa.png'},
    {name: 'computer', imageUrl: '/pets/computer.png'},
    {name: 'cookie-blossom', imageUrl: '/pets/cookie-blossom.png'},
    {name: 'crab', imageUrl: '/pets/crab.png'},
    {name: 'duck', imageUrl: '/pets/duck.png'},
    {name: 'egg-child', imageUrl: '/pets/egg-child.png'},
    {name: 'fox', imageUrl: '/pets/fox.png'},
    {name: 'ghost', imageUrl: '/pets/ghost.png'},
    {name: 'man-arab', imageUrl: '/pets/man-arab.png'},
    {name: 'man-old', imageUrl: '/pets/man-old.png'},
    {name: 'metamong-blue', imageUrl: '/pets/metamong-blue.png'},
    {name: 'metamong-purple', imageUrl: '/pets/metamong-purple.png'},
    {name: 'mushroom', imageUrl: '/pets/mushroom.png'},
    {name: 'oni', imageUrl: '/pets/oni.png'},
    {name: 'penguin', imageUrl: '/pets/penguin.png'},
    {name: 'pigeon', imageUrl: '/pets/pigeon.png'},
    {name: 'pikachu', imageUrl: '/pets/pikachu.png'},
    {name: 'rabbit', imageUrl: '/pets/rabbit.png'},
    {name: 'raccoon', imageUrl: '/pets/raccoon.png'},
    {name: 'rat', imageUrl: '/pets/rat.png'},
    {name: 'robot', imageUrl: '/pets/robot.png'},
    {name: 'sandshrew', imageUrl: '/pets/sandshrew.png'},
  ];

  const [isModalOpen, setModalOpen] = useState(false)
  
  const handleModalOpen = (() => {
    setModalOpen(true)
  })

  const handleModalClose = (() => {
    setModalOpen(false)
  })
  
  return (
    <section className="mt-8">
      {/* 현재 연도와 달 표시 (ex: 2024년 9월) */}
      <h2 className="text-center text-xl font-semibold">2024년 9월</h2>

      {/* 주차별 획득한 펫 카드 컴포넌트 */}
      {/* 클릭 시 모달 오픈 */}
      <div className="mt-4 mx-auto bg-[#ECF1F3] rounded-lg w-[277px] h-[111.91px] flex items-center justify-between px-4" onClick={handleModalOpen}>
        {/* 금융 정보 받아오면서 날짜 정보를 받거나 우리가 처리하는 걸로 하고 */}
        <div className="text-left">
          <p>9월 1주차</p>
          <p className="text-lg font-semibold">{petSpriteMetaData[0].name}</p>
          {/* 승/패 정보는 추후 정보를 가져와야겠지? */}
          <div className="flex space-x-2 mt-1">
            <span className="bg-[#C8E697] text-black py-1 px-3 rounded-full">10승</span>
            <span className="bg-[#D23B8C] text-white py-1 px-3 rounded-full">3패</span>
          </div>
        </div>
        <div className="bg-[#919AA2] rounded-lg w-20 h-20 flex items-center justify-center">
          {/* 펫 이미지 추가 위치 */}
          <PetSprite imageUrl="/pets/bear-brown.png" isUnlocked={true}/> 
        </div>
      </div>
      {/* 펫 상세 정보 모달 */}
      <PetDetailModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        petName={petSpriteMetaData[0].name}
        petIndex={1}  // 예시로 No.1
        petImageUrl={petSpriteMetaData[0].imageUrl}
        petTrait="food"  // 예시로 food 특성
      />
    </section>
  );
};

export default RecordSection;
