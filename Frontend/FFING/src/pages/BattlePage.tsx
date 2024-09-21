import Phaser from 'phaser';
import { useEffect, useRef, useState } from 'react';
import useViewportStore from '../store/useViewportStore'; // Zustand 저장소 사용
import myPetSpriteSheet from '/pets/crab.png';
import opponentPetSpriteSheet from '/pets/oldman.png';
import battleBackground from '/backgrounds/battle-background.png';
import AttackSelection from '../../src/components/Game/AttackSelection';
import AttackResult from '.../../src/components/Game/AttackResult'
import GameBar from '../components/Game/GameBar';
import NavBar from '../components/Common/Navbar';

const BattlePage: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { dvw, dvh } = useViewportStore(); // Zustand에서 동적 뷰포트 크기 가져오기

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: dvw * 100,  // 뷰포트에 맞춘 캔버스 너비
      height: dvh * 100,  // 뷰포트 높이를 100%로 제한
      backgroundColor: '#000',
      parent: gameContainerRef.current || undefined,
      scene: {
        preload: preload,
        create: create,
        update: update
      },
      scale: {
        mode: Phaser.Scale.RESIZE,  // 게임 크기를 뷰포트에 맞게 조정
        autoCenter: Phaser.Scale.CENTER_BOTH,  // 중앙 정렬
      },
    };

    const game = new Phaser.Game(config);

    function preload(this: Phaser.Scene) {
      this.load.image('background', battleBackground);
      this.load.spritesheet('mypet', myPetSpriteSheet, {
        frameWidth: 128,
        frameHeight: 128,
      });
      this.load.spritesheet('opponentpet', opponentPetSpriteSheet, {
        frameWidth: 128,
        frameHeight: 128,
      })
    }

    function create(this: Phaser.Scene) {
      // 화면 크기에 따라 배경 이미지 크기와 위치 조정
      const background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
      background.setOrigin(0.5, 0.5);
      background.setDisplaySize(this.scale.width, this.scale.height);  // 화면 크기에 맞추기

      // 펫의 위치를 동적으로 설정
      const myPet = this.add.sprite(this.scale.width - 300, this.scale.height - 100, 'mypet');
      myPet.setScale(1);
      
      const opponentPet = this.add.sprite(this.scale.width - 100, this.scale.height - 100, 'opponentpet');
      opponentPet.flipX = true;
      opponentPet.setScale(1);

      this.anims.create({
        key: 'my-pet-idle',
        frames: this.anims.generateFrameNumbers('mypet', { start: 128, end: 142 }),
        frameRate: 5,
        repeat: -1
      });
      myPet.play('my-pet-idle');

      this.anims.create({
        key: 'opponent-pet-idle',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 128, end: 142 }),
        frameRate: 5,
        repeat: -1
      });
      opponentPet.play('opponent-pet-idle');
    }

    function update() {}

    return () => {
      game.destroy(true);
    };
  }, [dvw, dvh]); // 뷰포트 크기 변경 시 재렌더링

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header>
          <GameBar />
        </header>

        {/* 닉네임 */}
        <div className="flex justify-center items-center text-xl font-bold mt-4">
          <span className='mr-4'>USER123</span>
          <span className='mx-4'>vs</span>
          <span className='ml-4'>USER456</span>
        </div>
        {/* Phaser 게임 컨테이너 */}
        <div ref={gameContainerRef} style={{ position: 'relative', width: '100%', height: '40vh'}} />
        {/* 공격 선택 컴포넌트 */}
        <div>
          <AttackSelection />
        </div>
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default BattlePage;
