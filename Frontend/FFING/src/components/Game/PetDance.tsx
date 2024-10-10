import Phaser from 'phaser';
import React, { useEffect, useRef } from 'react';
import pet1Sprite from '/pets/raccoon.png';
import pet2Sprite from '/pets/fox.png';
import pet3Sprite from '/pets/penguin.png';

const PetDance: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current || undefined,
      backgroundColor: '#FFF',
      transparent: true,
      width: '100%',
      height: '100%',
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 500 },
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.NONE,
      },
    };

    const game = new Phaser.Game(config);

    function preload(this: Phaser.Scene) {
      this.load.spritesheet('pet1', pet1Sprite, { frameWidth: 128, frameHeight: 128 });
      this.load.spritesheet('pet2', pet2Sprite, { frameWidth: 128, frameHeight: 128 });
      this.load.spritesheet('pet3', pet3Sprite, { frameWidth: 128, frameHeight: 128 });
    }

    // 펫 생성 및 초기 설정 함수
    function createPet(this: Phaser.Scene, key: string, x: number, flipX: boolean) {
      const pet = this.physics.add.sprite(x, this.scale.height + 1, key);
      pet.setScale(0.5);
      pet.setCollideWorldBounds(true);
      pet.flipX = flipX;
      return pet;
    }

    // 펫의 이동 애니메이션 설정 함수
    function createAnimations(this: Phaser.Scene, pet: Phaser.Physics.Arcade.Sprite, key: string) {
      this.anims.create({
        key: `run-${key}`,
        frames: this.anims.generateFrameNumbers(key, { start: 1, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: `jump-${key}`,
        frames: this.anims.generateFrameNumbers(key, { start: 144, end: 151 }),
        frameRate: 5,
        repeat: 0,
      });

      pet.play(`run-${key}`);
    }

    // 펫 점프 설정 함수
    function setupJump(this: Phaser.Scene, pet: Phaser.Physics.Arcade.Sprite, key: string) {
      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => {
          pet.play(`jump-${key}`);
          pet.setVelocityY(-300);
        },
        loop: true,
      });

      pet.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
        if (animation.key === `jump-${key}`) {
          pet.play(`run-${key}`);
        }
      });
    }

    // 화면 경계 충돌 시 처리하는 함수
    function handleWorldBounds(this: Phaser.Scene, body: Phaser.Physics.Arcade.Body, pet: Phaser.Physics.Arcade.Sprite) {
      const screenWidth = this.scale.width;  // 화면 너비 가져오기

      // 바닥에만 닿는 경우 무시
      if (body.blocked.down && !(body.blocked.left || body.blocked.right)) {
        return;
      }

      // 왼쪽 경계에 닿았을 때 처리
      if (body.blocked.left && pet.x <= screenWidth * 0.1) {
        pet.setVelocityX(Math.abs(pet.body.velocity.x + 150)); // 속도 반대로
        pet.flipX = !pet.flipX; // 방향 전환
      }

      // 오른쪽 경계에 닿았을 때 처리
      if (body.blocked.right && pet.x >= screenWidth * 0.9) {
        pet.setVelocityX(-Math.abs(pet.body.velocity.x + 150)); // 속도 반대로
        pet.flipX = !pet.flipX; // 방향 전환
      }
    }

    // 충돌 시 반대 방향으로 이동하는 함수
    function onPetCollision(petA: Phaser.Physics.Arcade.Sprite, petB: Phaser.Physics.Arcade.Sprite) {
      if (petA.body.touching.right) {
        petA.setVelocityX(-Math.abs(petA.body.velocity.x + 150));
        petA.flipX = true;
      } else if (petA.body.touching.left) {
        petA.setVelocityX(Math.abs(petA.body.velocity.x + 150));
        petA.flipX = false;
      }

      if (petB.body.touching.right) {
        petB.setVelocityX(-Math.abs(petB.body.velocity.x + 150));
        petB.flipX = true;
      } else if (petB.body.touching.left) {
        petB.setVelocityX(Math.abs(petB.body.velocity.x + 150));
        petB.flipX = false;
      }
    }

    function create(this: Phaser.Scene) {
      // 로고 문구 렌더링
      const text = this.add.text(this.scale.width / 2, this.scale.height / 2, 'FFING', { fontFamily: 'Galmuri11-Bold', fontSize: 80, color: '#000' });
      text.setAlpha(0);  // 초기 투명도 설정 (보이지 않음)
      text.setScale(0.5);  // 초기 크기 설정 (작게 시작)
      text.setOrigin(0.5, 0.5);  // 텍스트의 중심을 화면 중앙으로 설정

      // 트윈을 사용하여 서서히 나타나면서 확대
      this.tweens.add({
        targets: text,
        alpha: { from: 0, to: 1 },  // 0에서 1로 서서히 보이게 함
        scale: { from: 0.5, to: 1.5 },  // 크기를 0.5에서 1.5로 확대
        ease: 'Power1',  // 애니메이션 곡선(완만하게 가속/감속)
        duration: 2000,  // 2초 동안 애니메이션
      });

      // 펫 객체 생성
      const pet1 = createPet.call(this, 'pet1', this.scale.width * 0.2, false);
      const pet2 = createPet.call(this, 'pet2', this.scale.width * 0.8, true);
      const pet3 = createPet.call(this, 'pet3', this.scale.width * 0.5, false); 

      // 펫 속도 설정
      pet1.setVelocityX(Phaser.Math.Between(Math.floor(Math.random() * 200), Math.floor(Math.random() * 500)));
      pet2.setVelocityX(Phaser.Math.Between(-Math.floor(Math.random() * 200), -Math.floor(Math.random() * 500)));
      pet3.setVelocityX(Phaser.Math.Between(Math.floor(Math.random() * 200), Math.floor(Math.random() * 500)));

      // 충돌 시 반대 방향으로 이동하는 처리
      this.physics.add.collider(pet1, pet2, onPetCollision);
      this.physics.add.collider(pet1, pet3, onPetCollision);
      this.physics.add.collider(pet2, pet3, onPetCollision);

      createAnimations.call(this, pet1, 'pet1');
      createAnimations.call(this, pet2, 'pet2');
      createAnimations.call(this, pet3, 'pet3');

      setupJump.call(this, pet1, 'pet1');
      setupJump.call(this, pet2, 'pet2');
      setupJump.call(this, pet3, 'pet3');

      // 화면 경계에 부딪힐 때 방향 전환 처리
      pet1.body.onWorldBounds = true;
      pet2.body.onWorldBounds = true;
      pet3.body.onWorldBounds = true;

      this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
        if (body.gameObject === pet1) {
          handleWorldBounds.call(this, body, pet1);
        } else if (body.gameObject === pet2) {
          handleWorldBounds.call(this, body, pet2);
        } else if (body.gameObject === pet3) {
          handleWorldBounds.call(this, body, pet3);
        }
      });
    }

    function update(this: Phaser.Scene) {}

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameContainerRef} />;
};

export default PetDance;
