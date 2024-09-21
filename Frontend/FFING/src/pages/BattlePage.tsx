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

const BattlePage: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const { dvw, dvh } = useViewportStore(); // Zustand에서 동적 뷰포트 크기 가져오기
  const [selectedAttack, setSelectedAttack] = useState<{ name: string; damage: number } | null>(null);
  const [myHp, setMyHp] = useState<number>(100)
  const [opponentHp, setOpponentHp] = useState<number>(100)

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
      
      // 체력 바 추가
      const myHpBar = this.add.graphics();
      myHpBar.fillStyle(0x000000, 1); // 검은색 배경
      myHpBar.fillRoundedRect(50, 50, 100, 20, 10); // 위치와 크기 설정
      const myHpFill = this.add.graphics();
      myHpFill.fillStyle(0xff0000, 1); // 빨간색 현재 체력
      myHpFill.fillRoundedRect(50, 50, 100 * (myHp / 100), 20, 10); // 체력에 따른 너비 조절

      const opponentHpBar = this.add.graphics();
      opponentHpBar.fillStyle(0x000000, 1); // 검은색 배경
      opponentHpBar.fillRoundedRect(this.scale.width - 100, 50, 100, 20, 10);
      const opponentHpFill = this.add.graphics();
      opponentHpFill.fillStyle(0xff0000, 1); // 빨간색 현재 체력
      opponentHpFill.fillRoundedRect(this.scale.width - 100, 50, 100 * (opponentHp / 100), 20, 10);

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

      // 공격 선택 시 walk 상태로 변경
      if (selectedAttack) {
        myPet.play('my-pet-walk');
        opponentPet.play('opponent-pet-walk');
      }

      // 근접 공격 틀 추가
      this.tweens.add({
        targets: myPet,
        x: opponentPet.x - 200, // 상대방 앞까지 이동
        duration: 500,
        onComplete: () => {
          // 펫이 공격 모션을 취함
          myPet.play('my-pet-attack');
          this.time.delayedCall(500, () => {
            this.tweens.add({
              targets: myPet,
              x: myPet.x + 200, // 원래 위치로 복귀
              duration: 500,
              onComplete: () => {
                myPet.play('my-pet-idle');
              }
            });
          })
        },
      });
    }

    function update() {}

    return () => {
      game.destroy(true);
    };
  }, [dvw, dvh, selectedAttack]); // 뷰포트 크기 변경 시 재렌더링
  
  const handleAttackSelect = (attackName: string) => {
    console.log(1)
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