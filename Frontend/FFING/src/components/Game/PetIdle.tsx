import Phaser from 'phaser';
import { useEffect, useRef, useState } from 'react';
import useViewportStore from '../../store/useViewportStore'; // Zustand 저장소 사용
import petSpriteSheet from '/pets/penguin.png';
import petIdleBackground from '/backgrounds/pet-idle-background.png';
import SpeechBubble from '../Common/SpeechBubble';

const PetIdle: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { dvw, dvh } = useViewportStore(); // Zustand에서 동적 뷰포트 크기 가져오기
  const [petPosition, setPetPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState(dvw * 100); // 화면 너비 맞추기

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
      this.load.image('background', petIdleBackground);
      this.load.spritesheet('pet', petSpriteSheet, {
        frameWidth: 128,
        frameHeight: 128,
      });
    }

    function create(this: Phaser.Scene) {
      setContainerWidth(this.scale.width);  // 컨테이너의 너비 업데이트

      // 화면 크기에 따라 배경 이미지 크기와 위치 조정
      const background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
      background.setOrigin(0.5, 0.5);
      background.setDisplaySize(this.scale.width, this.scale.height);  // 화면 크기에 맞추기

      // chip 요소 추가 및 좌상단 위치 설정
      const chip = this.add.text(10, 10, '138승', {
        fontSize: '20px',
        backgroundColor: '#C8E697',
        color: '#000',
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
        align: 'center'
      });
      chip.setOrigin(0, 0);

      // 펫의 위치를 동적으로 설정
      const pet = this.add.sprite(this.scale.width - 100, this.scale.height - 50, 'pet');
      pet.flipX = true;
      pet.setScale(0.5);

      // 펫의 위치를 상태로 저장
      setPetPosition({ x: pet.x, y: pet.y - pet.displayHeight / 2 - 20 });

      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('pet', { start: 1, end: 2 }),
        frameRate: 1,
        repeat: -1
      });
      pet.play('idle');
    }

    function update() {}

    return () => {
      game.destroy(true);
    };
  }, [dvw, dvh]); // 뷰포트 크기 변경 시 재렌더링

  return (
    <div ref={gameContainerRef} style={{ position: 'relative', width: '100%', height: '40vh'}}>
      {/* 펫 말풍선 */}
      <SpeechBubble
        text="안녕! 난 펫이야!"
        x={petPosition.x}
        y={petPosition.y}
        containerWidth={containerWidth}
      />
    </div>
  );
};

export default PetIdle;
