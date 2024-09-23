import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import useViewportStore from '../../store/useViewportStore';
// 우선 펫 시트는 임의로 지정, 나중에 연동해야겠지?
import myPetSpriteSheet from '/pets/crab.png';
import opponentPetSpriteSheet from '/pets/oldman.png';
import battleBackground from '/backgrounds/battle-background.png';

interface PhaserGameProps {
  selectedAttack: { name: string; damage: number } | null;
  opponentAttack: { name: string; damage: number } | null;
  setSelectedAttack: (attack: { name: string; damage: number } | null) => void;
  setOpponentAttack: (attack: { name: string; damage: number } | null) => void;
  setWinner: (winner: string) => void;
}

const PhaserGame: React.FC<PhaserGameProps> = ({ selectedAttack, opponentAttack, setSelectedAttack, setOpponentAttack, setWinner }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { dvw, dvh } = useViewportStore();
  const [myHp, setMyHp] = React.useState<number>(10);
  const [opponentHp, setOpponentHp] = React.useState<number>(10);
  const [isBattleInProgress, setIsBattleInProgress] = React.useState<boolean>(false);

  useEffect(() => {
    if (!gameContainerRef.current) return;

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
      const background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
      background.setOrigin(0.5, 0.5);
      background.setDisplaySize(this.scale.width, this.scale.height);

      const myPet = this.add.sprite(this.scale.width - 300, this.scale.height - 100, 'mypet');
      myPet.setScale(1);
      // 공격 팔 설정
      const myPetAttackEffect = this.add.sprite(myPet.x, myPet.y, 'mypet')
      myPetAttackEffect.setVisible(false);
      const opponentPet = this.add.sprite(this.scale.width - 100, this.scale.height - 100, 'opponentpet');
      opponentPet.flipX = true;
      opponentPet.setScale(1);

      const myHpBar = this.add.graphics();
      myHpBar.fillStyle(0x000000, 1);
      myHpBar.fillRoundedRect(myPet.x - 50, myPet.y - 100, 100, 20, 10);
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

      this.anims.create({
        key: 'my-pet-walk',
        frames: this.anims.generateFrameNumbers('mypet', { start: 1, end: 8 }),
        frameRate: 5,
        repeat: -1,
      });

      this.anims.create({
        key: 'opponent-pet-walk',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 1, end: 8 }),
        frameRate: 5,
        repeat: -1,
      });

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

      this.anims.create({
        key: 'my-pet-attack-motion',
        frames: this.anims.generateFrameNumbers('mypet', { start: 204, end: 205 }),
        frameRate: 5,
        repeat: 0,
      })

      this.anims.create({
        key: 'opponent-pet-attack-motion',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 202, end: 207 }),
        frameRate: 5,
        repeat: 0,
      })

      const moveToOpponent = (pet: Phaser.GameObjects.Sprite, opponent: Phaser.GameObjects.Sprite): Promise<void> => {
        return new Promise((resolve) => {
          pet.play('my-pet-walk')
          const tween = pet.scene.tweens.add({
            targets: pet,
            x: opponent.x - 100,
            y: opponent.y,
            // tween 애니메이션의 속도
            ease: 'power2',
            duration: 1000,
            onComplete: () => {
              pet.play('my-pet-attack')
              myPetAttackEffect.setVisible(true); // 팔 보이게 하기
              myPetAttackEffect.setPosition(opponent.x, opponent.y); // 팔의 위치를 상대 펫에 맞추기
              myPetAttackEffect.setDepth(opponent.depth + 1); // z-index 설정
              myPetAttackEffect.play('my-pet-attack-motion'); // 팔 애니메이션 재생

              pet.on('animationcomplete-my-pet-attack', () => {
                myPetAttackEffect.setVisible(false);
                pet.play('my-pet-walk')
                resolve();
              })
            }
          })
        })
      }



      const executeAttack = async () => {
      if (!selectedAttack || !opponentAttack) return;
      
      const mySpeed = 10;
      const opponentSpeed = 5;
      
      if (mySpeed >= opponentSpeed) {
        // 내 공격
        await moveToOpponent(myPet, opponentPet)
        setOpponentHp((prevHp) => Math.max(prevHp - selectedAttack.damage, 0));
        setSelectedAttack(null)
        if (opponentHp - selectedAttack.damage <= 0) {
          setWinner('USER123');
          return;
        }
        
        // 상대방의 반격
        setTimeout(() => {
          setMyHp((prevHp) => Math.max(prevHp - opponentAttack.damage, 0));
          setOpponentAttack(null)
          if (myHp - opponentAttack.damage <= 0) {
            setWinner('USER456');
            return;
          }
        }, 1000)
      } else {
        // 상대방 먼저 공격
        setTimeout(async () => {
          setMyHp((prevHp) => Math.max(prevHp - opponentAttack.damage, 0));
          setOpponentAttack(null)
          if (myHp - opponentAttack.damage <= 0) {
            setWinner('USER456');
            return;
          }
          
          // 내 펫의 반격
          setTimeout(async () => {
            setOpponentHp((prevHp) => Math.max(prevHp - selectedAttack.damage, 0));
            if (opponentHp - selectedAttack.damage <= 0) {
              setWinner('USER123');
              return
            }
          })
        }, 1000);
      }
    }
    
    if (selectedAttack && opponentAttack) {
      executeAttack()
    }
  }

    function update() {}

    return () => {
      game.destroy(true);
    };
  }, [dvw, dvh, myHp, opponentHp, isBattleInProgress, selectedAttack, opponentAttack, setWinner, setSelectedAttack, setOpponentAttack]);

  return <div ref={gameContainerRef} className="border-4 border-black round-lg" style={{ width: '100%', height: '40vh' }} />;
};

export default PhaserGame;
