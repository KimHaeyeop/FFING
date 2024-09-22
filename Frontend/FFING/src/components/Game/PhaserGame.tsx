import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import useViewportStore from '../../store/useViewportStore';
import myPetSpriteSheet from '/pets/crab.png';
import opponentPetSpriteSheet from '/pets/oldman.png';
import battleBackground from '/backgrounds/battle-background.png';

interface PhaserGameProps {
  selectedAttack: { name: string; damage: number } | null;
  opponentAttack: { name: string; damage: number } | null;
  setWinner: (winner: string) => void;
}


const PhaserGame: React.FC<PhaserGameProps> = ({ selectedAttack, opponentAttack, setWinner }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { dvw, dvh } = useViewportStore();
  const [myHp, setMyHp] = React.useState<number>(10);
  const [opponentHp, setOpponentHp] = React.useState<number>(10);
  const [isBattleInProgress, setIsBattleInProgress] = React.useState<boolean>(false);

  const setOpponentAttackRandomly = () => {
    return {
      name: '쇼핑',
      damage: Math.floor(Math.random() * 10) + 1,
    };
  };

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: dvw * 100,
      height: dvh * 100,
      backgroundColor: '#000',
      parent: gameContainerRef.current || undefined,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
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
      });
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
      
      // 체력 바 위치를 펫의 머리 위로 조정
      const myHpBar = this.add.graphics();
      myHpBar.fillStyle(0x000000, 1);
      myHpBar.fillRoundedRect(myPet.x - 50, myPet.y - 100, 100, 20, 10);  // 펫의 y 위치 위로 이동
      const myHpFill = this.add.graphics();
      myHpFill.clear();
      myHpFill.fillStyle(0xff0000, 1);
      myHpFill.fillRoundedRect(myPet.x - 50, myPet.y - 100, 100 * (myHp / 10), 20, 10);

      const opponentHpBar = this.add.graphics();
      opponentHpBar.fillStyle(0x000000, 1);
      opponentHpBar.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, 100, 20, 10);
      const opponentHpFill = this.add.graphics();
      opponentHpFill.clear();
      opponentHpFill.fillStyle(0xff0000, 1);
      opponentHpFill.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, 100 * (opponentHp / 10), 20, 10);

      // 체력 변화에 따른 실시간 업데이트
      const updateHpBars = () => {
        myHpBar.clear();
        myHpBar.fillStyle(0x000000, 1);
        myHpBar.fillRoundedRect(myPet.x - 50, myPet.y - 100, 100, 20, 10);
        const myHpFill = this.add.graphics();
        myHpFill.clear();
        myHpFill.fillStyle(0xff0000, 1);
        myHpFill.fillRoundedRect(myPet.x - 50, myPet.y - 100, 100 * (myHp / 100), 20, 10);

        opponentHpBar.clear();
        opponentHpBar.fillStyle(0x000000, 1);
        opponentHpBar.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, 100, 20, 10);
        const opponentHpFill = this.add.graphics();
        opponentHpFill.clear();
        opponentHpFill.fillStyle(0xff0000, 1);
        opponentHpFill.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, 100 * (opponentHp / 100), 20, 10);
      };

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

      // 공격을 위한 이동
      this.anims.create({
        key: 'my-pet-walk',
        frames: this.anims.generateFrameNumbers('mypet', { start: 1, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: 'opponent-pet-walk',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 1, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      // 공격 
      this.anims.create({
        key: 'my-pet-attack',
        frames: this.anims.generateFrameNumbers('mypet', { start: 48, end: 55 }),
        frameRate: 10,
        repeat: 0,
      });

      this.anims.create({
        key: 'opponent-pet-attack',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 48, end: 55 }),
        frameRate: 10,
        repeat: 0,
      });
      
      // 공격 모션 처리
      const executeAttack = (attacker: Phaser.GameObjects.Sprite, target: Phaser.GameObjects.Sprite, damage: number, isMyAttack: boolean): Promise<void> => {
        return new Promise((resolve) => {
          // 내 공격일 때
          if (isMyAttack) {
            // 상대 앞으로 가기
            attacker.play('my-pet-walk');
            this.tweens.add({
              targets: attacker,
              x: attacker.x + 100,
              duration: 500,
              onComplete: () => {
                // 상대를 향해서 근접 공격 하기
                attacker.play('my-pet-attack');
                this.time.delayedCall(500, () => {
                  // 내 자리로 다시 돌아가기
                  attacker.play('my-pet-walk');
                  this.tweens.add({
                    targets: attacker,
                    x: attacker.x - 100,
                    duration: 500,
                    onComplete: () => {
                      // 다시 대기 상태
                      attacker.play('my-pet-idle');
                      setOpponentHp((prevHp) => {
                        const newHp = Math.max(prevHp - damage, 0)
                        // 체력 바 업데이트
                        updateHpBars();
                        return newHp
                    });
                      resolve(); // 공격이 완료되면 Promise를 해결
                    }
                  });
                });
              }
            });
            // 상대 차례일 때
          } else {
            attacker.play('opponent-pet-walk');
            this.tweens.add({
              targets: attacker,
              x: attacker.x - 100,
              duration: 500,
              onComplete: () => {
                attacker.play('opponent-pet-attack');
                this.time.delayedCall(500, () => {
                  attacker.play('opponent-pet-walk');
                  this.tweens.add({
                    targets: attacker,
                    x: attacker.x + 100,
                    duration: 500,
                    onComplete: () => {
                      attacker.play('opponent-pet-idle');
                      setMyHp((prevHp) => {
                        const newHp = Math.max(prevHp - damage, 0)
                        // 체력 바 업데이트
                        updateHpBars();
                        return newHp
                      });
                      resolve(); // 공격이 완료되면 Promise를 해결
                    }
                  });
                });
              }
            });
          }
        });
      };

      // 공격이 모두 선택되었을 때 동작
      if (selectedAttack && opponentAttack && !isBattleInProgress) {
        // 전투 시작
        setIsBattleInProgress(true);
        (async () => {
          // 내가 먼저 공격
          await executeAttack(myPet, opponentPet, selectedAttack.damage, true)
          console.log('내가 침')
          console.log(opponentHp, myHp)
          if (opponentHp > 0) {
            // 상대방이 공격
            await executeAttack(opponentPet, myPet, opponentAttack.damage, false)
            
            if (myHp > 0) {
              // 공격이 완료된 후에만 초기화
              setSelectedAttack(null);
              setOpponentAttack(null);
              setOpponentAttackRandomly();  // 상대방 공격 다시 설정
              setIsBattleInProgress(false)
            } else {
              setWinner('Opponent')
            } 
          } else {
              setWinner('User')
            }
          })()
        }
      }
    function update() {}

    return () => {
      game.destroy(true);
    };
  }, [dvw, dvh, selectedAttack, opponentAttack, myHp, opponentHp]);

  return <div ref={gameContainerRef} className="border-4 border-black round-lg" style={{ width: '100%', height: '40vh' }} />;
};

export default PhaserGame;
