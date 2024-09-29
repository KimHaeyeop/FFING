import React from "react";
import PetSprite from "./PetSprite";

const PetPediaSection: React.FC = () => {
  // 사용자가 펫을 발견한 적이 있는지 확인하는 과정이 필요함
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


  return (
    // 배경 색상 추가
    <div className="bg-[#0A3711]">
      <section className="mt-8 grid grid-cols-3 gap-4">
        {/* 펫 도감 리스트 - 각 요소는 3개씩 한 행에 배치 */}
        {petSpriteMetaData.map((pet, index) => (
          <div key={index} className="bg-[#BBBBBB] rounded-lg p-4 flex items-center justify-center">
            {/* 획득한 펫 이미지 추가 위치 */}
            <PetSprite imageUrl={pet.imageUrl} />
          </div>
        ))}
        {/* 추가적인 도감 요소 */}
      </section>
    </div>
  );
};

export default PetPediaSection;
