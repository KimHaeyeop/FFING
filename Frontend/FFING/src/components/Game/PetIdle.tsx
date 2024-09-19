import Phaser from 'phaser';
import { useEffect, useRef, useState } from 'react';
import SpeechBubble from '../Common/SpeechBubble';
import petIdleBackground from '/pet-idle-background.png';
import petSpriteSheet from '/basic-pet-sprite-sheet.png';

const PetIdle: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [petPosition, setPetPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 350,
      height: 200,
      backgroundColor: '#000',
      parent: gameContainerRef.current || undefined,
      scene: {
        preload: preload,
        create: create,
        update: update
      }
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
      const background = this.add.image(175, 100, 'background');
      background.setOrigin(0.5, 0.5);  // 중심점 설정
      background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);  // 화면 크기에 맞추기

      // chip 요소 추가 및 좌상단 위치 설정
      const chip = this.add.text(10, 10, '138승', {
        fontSize: '20px',
        backgroundColor: '#C8E697',
        color: '#000',
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
        align: 'center'
      });
      // 텍스트를 원형 배경의 중앙에 맞춥니다.
      chip.setOrigin(0, 0);

      const pet = this.add.sprite(300, 160, 'pet');
      pet.flipX = true
      pet.setScale(0.5);
      // 펫의 위치를 상태로 저장
      setPetPosition({ x: pet.x, y: pet.y - pet.displayHeight / 2 - 20 });


      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('pet', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
      });
      pet.play('idle');
    }

    function update() {}

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div ref={gameContainerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* SpeechBubble을 펫 위치를 기준으로 렌더링 */}
      <SpeechBubble text="안녕! 난 펫이야!" x={petPosition.x} y={petPosition.y} />
    </div>
  );
};

export default PetIdle;
