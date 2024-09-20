import Phaser from 'phaser';
import { useEffect, useRef } from 'react';

interface PetPhaserProps {
  animationState: 'idle' | 'attack' | 'damaged' | 'move';
  petSpriteSheet: string; // 펫 이미지 파일 경로를 동적으로 받음
  background: string; // 배경 이미지 파일 경로를 동적으로 받음
}

const PetPhaser: React.FC<PetPhaserProps> = ({ animationState, petSpriteSheet, background }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 400,
      height: 200,
      backgroundColor: '#000',
      parent: gameContainerRef.current || undefined,
      scene: {
        preload: preload,
        create: create,
        update: update
      },
    };

    const game = new Phaser.Game(config);

    function preload(this: Phaser.Scene) {
      // 배경과 펫 스프라이트를 동적으로 로드
      this.load.image('background', background);
      this.load.spritesheet('pet', petSpriteSheet, {
        frameWidth: 128,
        frameHeight: 128,
      });
    }

    function create(this: Phaser.Scene) {
      const bg = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
      bg.setOrigin(0.5, 0.5);
      bg.setDisplaySize(this.scale.width, this.scale.height);

      const pet = this.add.sprite(200, 100, 'pet');
      pet.setScale(0.5);

      this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('pet', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('pet', { start: 9, end: 16 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'damaged',
        frames: this.anims.generateFrameNumbers('pet', { start: 17, end: 20 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'move',
        frames: this.anims.generateFrameNumbers('pet', { start: 21, end: 28 }),
        frameRate: 10,
        repeat: -1
      });

      pet.play(animationState);
    }

    function update() {}

    return () => {
      game.destroy(true);
    };
  }, [animationState, petSpriteSheet, background]); // 펫 이미지와 배경 이미지가 변경될 때 Phaser를 다시 로드

  return <div ref={gameContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default PetPhaser;
