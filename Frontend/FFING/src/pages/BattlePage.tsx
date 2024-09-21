import Phaser from 'phaser';
import { useEffect, useRef, useState } from 'react';
import useViewportStore from '../store/useViewportStore'; // Zustand 저장소 사용
import myPetSpriteSheet from '/pets/crab.png';
import opponentPetSpriteSheet from '/pets/oldman.png';
import battleBackground from '/backgrounds/battle-background.png';
import AttackSelection from '../../src/components/Game/AttackSelection';
import AttackResult from '../../src/components/Game/AttackResult'
import GameBar from '../components/Game/GameBar';
import NavBar from '../components/Common/Navbar';

const attackOptions = [
  { name: '금융', damage: Math.floor(Math.random() * 10) + 1 },
  { name: '식비', damage: Math.floor(Math.random() * 10) + 1 },
  { name: '생활/문화', damage: Math.floor(Math.random() * 10) + 1 },
  { name: '교통', damage: Math.floor(Math.random() * 10) + 1 },
  { name: '쇼핑', damage: Math.floor(Math.random() * 10) + 1 },
];

// 임의의 공격 데이터를 설정합니다.
const mockOpponentAttack = {
  name: '쇼핑',
  damage: Math.floor(Math.random() * 10) + 1,
};



const BattlePage: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { dvw, dvh } = useViewportStore(); // Zustand에서 동적 뷰포트 크기 가져오기
  const [myHp, setMyHp] = useState<number>(100)
  const [opponentHp, setOpponentHp] = useState<number>(100)
  const [selectedAttack, setSelectedAttack] = useState<{ name: string; damage: number } | null>(null);
  const [opponentAttack, setOpponentAttack] = useState<{ name: string; damage: number } | null>(null);

  useEffect(() => {
    // 상대방의 공격을 임의로 설정 (2초 후 opponentAttack 설정)
    setTimeout(() => {
      setOpponentAttack(mockOpponentAttack);  // 임의로 상대방 공격 설정
    }, 2000);
  }, []);

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
      
      // 체력 바 위치를 펫의 머리 위로 조정
      const myHpBar = this.add.graphics();
      myHpBar.fillStyle(0x000000, 1);
      myHpBar.fillRoundedRect(myPet.x - 50, myPet.y - 100, 100, 20, 10);  // 펫의 y 위치 위로 이동
      const myHpFill = this.add.graphics();
      myHpFill.clear();
      myHpFill.fillStyle(0xff0000, 1);
      myHpFill.fillRoundedRect(myPet.x - 50, myPet.y - 100, 100 * (myHp / 100), 20, 10);

      const opponentHpBar = this.add.graphics();
      opponentHpBar.fillStyle(0x000000, 1);
      opponentHpBar.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, 100, 20, 10);
      const opponentHpFill = this.add.graphics();
      opponentHpFill.clear();
      opponentHpFill.fillStyle(0xff0000, 1);
      opponentHpFill.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, 100 * (opponentHp / 100), 20, 10);

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
          if (isMyAttack) {
            attacker.play('my-pet-walk');
            this.tweens.add({
              targets: attacker,
              x: attacker.x + 100,
              duration: 500,
              onComplete: () => {
                attacker.play('my-pet-attack');
                this.time.delayedCall(500, () => {
                  attacker.play('my-pet-walk');
                  this.tweens.add({
                    targets: attacker,
                    x: attacker.x - 100,
                    duration: 500,
                    onComplete: () => {
                      attacker.play('my-pet-idle');
                      setOpponentHp((prevHp) => Math.max(prevHp - damage, 0));
                      // 체력 바 업데이트
                      updateHpBars();
                      resolve(); // 공격이 완료되면 Promise를 해결
                    }
                  });
                });
              }
            });
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
                      setMyHp((prevHp) => Math.max(prevHp - damage, 0));
                      // 체력 바 업데이트
                      updateHpBars();
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
      if (selectedAttack && opponentAttack) {
        (async () => {
          await executeAttack(myPet, opponentPet, selectedAttack.damage, true)
          await executeAttack(opponentPet, myPet, opponentAttack.damage, false)
          setSelectedAttack(null);
          setOpponentAttack(null);
        })()
      }
    }

    function update() {}

    return () => {
      game.destroy(true);
    };
  }, [dvw, dvh, selectedAttack, opponentAttack]); // 뷰포트 크기 변경 시 재렌더링
  
  const handleAttackSelect = (attackName: string) => {
    const selected = attackOptions.find((attack) => attack.name === attackName);
    if (selected) {
      setSelectedAttack(selected);
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header>
          <GameBar />
        </header>
        {/* 닉네임 */}
        <div className="flex justify-center items-center text-xl font-bold my-2">
          <span className='mr-4'>USER123</span>
          <span className='mx-4'>vs</span>
          <span className='ml-4'>USER456</span>
        </div>
        {/* Phaser 게임 컨테이너 */}
        <div ref={gameContainerRef} className='border-4 border-black round-lg' style={{ position: 'relative', width: '100%', height: '40vh'}} />
        {/* 공격 선택 컴포넌트 */}
        <div className='mt-2'>
          {selectedAttack ? (
            <AttackResult selectedAttack={selectedAttack}/>
          ) : (
            <AttackSelection onSelectAttack={handleAttackSelect}/>
          )
        }
        </div>
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default BattlePage;