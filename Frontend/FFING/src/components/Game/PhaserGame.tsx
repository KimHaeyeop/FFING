import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import useViewportStore from '../../store/useViewportStore';
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

  // 공격을 수행하는 함수
  const executeAttack = () => {
    if (!selectedAttack || !opponentAttack) return;

    // 공격 순서 정의
    const mySpeed = 10; // 아직 속도 값이 정의되어 있지 않으므로 임시로 10으로 설정
    const opponentSpeed = 5; // 상대방 속도도 임시로 설정

    if (mySpeed >= opponentSpeed) {
      // 내 펫이 먼저 공격
      setOpponentHp((prevHp) => Math.max(prevHp - selectedAttack.damage, 0));
      // 공격을 선택한 후에는 null로 초기화
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
        return
      }
    }, 1000);
  } else {
    // 상대방이 먼저 공격
    setMyHp((prevHp) => Math.max(prevHp - opponentAttack.damage, 0));
    setOpponentAttack(null)
    if (myHp - opponentAttack.damage <= 0) {
      setWinner('USER456');
      return;
    }
    // 내 펫의 반격
    setTimeout(() => {
      setSelectedAttack(null)
      setOpponentHp((prevHp) => Math.max(prevHp - selectedAttack.damage, 0));
      if (opponentHp - selectedAttack.damage <= 0) {
        setWinner('USER123');
        return
      }
    }, 1000);
  }
};

  useEffect(() => {
    if (selectedAttack && opponentAttack) {
      executeAttack(); // selectedAttack, opponentAttack 값이 변경될 때마다 전투 수행
    }
  }, [selectedAttack, opponentAttack]);

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
      const background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
      background.setOrigin(0.5, 0.5);
      background.setDisplaySize(this.scale.width, this.scale.height);

      const myPet = this.add.sprite(this.scale.width - 300, this.scale.height - 100, 'mypet');
      myPet.setScale(1);
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
    }

    function update() {}

    return () => {
      game.destroy(true);
    };
  }, [dvw, dvh, myHp, opponentHp, isBattleInProgress, selectedAttack, opponentAttack, setWinner]);

  return <div ref={gameContainerRef} className="border-4 border-black round-lg" style={{ width: '100%', height: '40vh' }} />;
};

export default PhaserGame;
