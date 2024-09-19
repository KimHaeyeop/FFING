import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import petIdleBackground from '/pet-idle-background.png';
import petSpriteSheet from '/basic-pet-sprite-sheet.png';

const PetIdle: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

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
      const pet = this.add.sprite(300, 160, 'pet');
      pet.flipX = true
      pet.setScale(0.5);
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

  return <div ref={gameContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default PetIdle;
