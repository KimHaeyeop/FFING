import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import useViewportStore from '../../store/useViewportStore';
// 우선 펫과 배경 시트는 임의로 지정, 나중에 연동해야겠지?
import myPetSpriteSheet from '/pets/pikachu.png';
import opponentPetSpriteSheet from '/pets/metamong-purple.png';
import battleBackground from '/backgrounds/battle-background.png';

// battlePage에서 받는 props 요소
interface PhaserGameProps {
  selectedAttack: { name: string; damage: number } | null;
  opponentAttack: { name: string; damage: number } | null;
  setSelectedAttack: (attack: { name: string; damage: number } | null) => void;
  setOpponentAttack: (attack: { name: string; damage: number } | null) => void;
  setWinner: (winner: string) => void;
}

// 게임판 객체
const PhaserGame: React.FC<PhaserGameProps> = ({ selectedAttack, opponentAttack, setSelectedAttack, setOpponentAttack, setWinner }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null); // HTML DOM 요소를 참조하기 위한 ref
  const { dvw, dvh } = useViewportStore();  // 화면 뷰포트 크기 관리 (동적으로 화면 크기를 변경하기 위해 사용)
  const [myHp, setMyHp] = React.useState<number>(10); // 내 펫의 체력, 기본값 10(임시)
  const [opponentHp, setOpponentHp] = React.useState<number>(10);
  const [isBattleInProgress, setIsBattleInProgress] = React.useState<boolean>(false); // 전투 진행 여부를 관리 (승리자를 표시할 때 사용됨)

  useEffect(() => {
    if (!gameContainerRef.current) return;  // ref가 초기화되지 않았으면 실행하지 않음

    // Phaser 게임 설정 객체 (config)
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,  // Phaser가 CANVAS나 WEBGL 중 자동으로 선택함
      width: dvw * 100, // 뷰포트 너비에 맞춰 게임 캔버스 크기 설정
      height: '100%',
      backgroundColor: '#FFF',  // 배경색을 검정색으로 설정
      parent: gameContainerRef.current || undefined, // Phaser 게임이 렌더링될 HTML DOM 요소 (gameContainerRef)
      // Phaser 씬(Scene)을 정의하는 부분
      scene: {
        preload: preload, // 자원(이미지, 스프라이트 시트 등)을 미리 로드하는 함수
        create: create, // 씬이 처음 생성될 때 실행되는 함수
        update: update, // 씬이 매 프레임마다 호출되는 함수 (게임 루프에서 지속적으로 실행)
      },
      scale: {
        // mode: Phaser.Scale.RESIZE,  // 뷰포트 크기에 맞춰 자동으로 리사이즈됨
        autoCenter: Phaser.Scale.CENTER_BOTH, // 화면 중앙에 Phaser 캔버스를 배치
      },
    };

    // Phaser 게임 인스턴스를 생성
    const game = new Phaser.Game(config);

    // 자원을 미리 로드하는 함수
    function preload(this: Phaser.Scene) {
      this.load.image('background', battleBackground);  // 아래에서 'background'라는 이름을 통해 참조 가능
      this.load.spritesheet('mypet', myPetSpriteSheet, {
        frameWidth: 128,  // 각 프레임의 너비
        frameHeight: 128, // 각 프레임의 높이
      });
      this.load.spritesheet('opponentpet', opponentPetSpriteSheet, {
        frameWidth: 128,
        frameHeight: 128,
      });
    }

    // 씬이 처음 생성될 때 실행되는 함수
    function create(this: Phaser.Scene) {
      // 배경 추가
      const background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
      background.setOrigin(0.5, 0.5); // 이미지의 중심을 기준으로 배치
      background.setDisplaySize(this.scale.width, this.scale.height); // 배경 이미지를 화면 크기에 맞춤

      // 내 펫 스프라이트 추가
      const myPet = this.add.sprite(this.scale.width - 300, this.scale.height - 100, 'mypet');
      myPet.setScale(1);
      myPet.setDepth(1)

      // 내 펫의 채찍(무기) 생성
      const myPetRope = this.add.sprite(myPet.x, myPet.y, 'mypet')
      myPetRope.setVisible(false);  // 채찍은 공격할 때만 보이게 기본적으로 숨긴다.

      // 내 펫 기절 시 기절 아이콘 생성
      const myPetStunMark = this.add.sprite(myPet.x, myPet.y - 50, 'mypet')
      myPetStunMark.setVisible(false) // 기절 모션은 기절할 때만 보여야 한다.

      // 상대 펫 스프라이트 추가
      const opponentPet = this.add.sprite(this.scale.width - 100, this.scale.height - 100, 'opponentpet');
      opponentPet.flipX = true; // 스프라이트 좌우 반전
      opponentPet.setScale(1);
      
      // 상대 펫의 채찍 생성
      const opponentPetRope = this.add.sprite(opponentPet.x, opponentPet.y, 'opponentpet')
      opponentPetRope.flipX = true;
      opponentPetRope.setVisible(false);
      
      // 상대 펫 기절 시 기절 아이콘 생성
      const opponentPetStunMark = this.add.sprite(opponentPet.x, opponentPet.y - 50, 'opponentpet')
      opponentPetStunMark.flipX = true;
      opponentPetStunMark.setVisible(false);

      // 내 펫 체력바 생성
      const myHpBar = this.add.graphics();
      myHpBar.fillStyle(0x000000, 1); 
      myHpBar.fillRoundedRect(myPet.x - 50, myPet.y - 100, 100, 20, 10);  // (x위치, y위치, 가로 길이, 세로 길이, ?) 설정

      // 내 펫 체력 표시
      const myHpFill = this.add.graphics();
      myHpFill.clear();
      myHpFill.fillStyle(0xff0000, 1);
      myHpFill.fillRoundedRect(myPet.x - 50, myPet.y - 100, 100 * (myHp / 10), 20, 10);

      // 상대방 전체 체력 생성하기
      const opponentHpBar = this.add.graphics();
      opponentHpBar.fillStyle(0x000000, 1);
      opponentHpBar.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, 100, 20, 10);

      // 상대방 현재 체력 생성하기
      const opponentHpFill = this.add.graphics();
      opponentHpFill.clear();
      opponentHpFill.fillStyle(0xff0000, 1);
      opponentHpFill.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, 100 * (opponentHp / 10), 20, 10);

      // 애니메이션 설정 (펫의 idle 상태)
      this.anims.create({
        key: 'my-pet-idle',
        frames: this.anims.generateFrameNumbers('mypet', { start: 128, end: 129 }),
        frameRate: 1, // 1초에 1프레임 재생 속도
        repeat: -1  // 무한 반복
      });
      // 전투 기본 상태 실행
      myPet.play('my-pet-idle');

      this.anims.create({
        key: 'opponent-pet-idle',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 128, end: 129 }),
        frameRate: 1,
        repeat: -1
      });
      opponentPet.play('opponent-pet-idle');

      this.anims.create({
        key: 'my-pet-walk',
        frames: this.anims.generateFrameNumbers('mypet', { start: 0, end: 8 }),
        frameRate: 5,
        repeat: -1,
      });

      this.anims.create({
        key: 'opponent-pet-walk',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 0, end: 8 }),
        frameRate: 5,
        repeat: -1,
      });

      this.anims.create({
        key: 'my-pet-attack',
        frames: this.anims.generateFrameNumbers('mypet', { start: 64, end: 69 }),
        frameRate: 10,
        repeat: 0,  // 한 번만 재생
      });

      this.anims.create({
        key: 'my-pet-attack-motion',
        frames: this.anims.generateFrameNumbers('mypet', { start: 202, end: 207 }),
        frameRate: 10,
        repeat: 0,
      })

      this.anims.create({
        key: 'opponent-pet-attack',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 202, end: 207 }),
        frameRate: 10,
        repeat: 0,
      })
      
      this.anims.create({
        key: 'opponent-pet-attack-motion',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 202, end: 207 }),
        frameRate: 10,
        repeat: 0,
      })

      this.anims.create({
        key: 'my-pet-stun-bird',
        frames: this.anims.generateFrameNumbers('mypet', { start: 208, end: 219 }),
        frameRate: 10,
        repeat: 5,
      })

      this.anims.create({
        key: 'opponent-pet-stun-bird',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 208, end: 219 }),
        frameRate: 10,
        repeat: 5,
      })

      // 상대방을 공격하는 함수
      const AttackOpponent = (pet: Phaser.GameObjects.Sprite, opponent: Phaser.GameObjects.Sprite): Promise<void> => {
        return new Promise((resolve) => { // 비동기 실행을 위한 Promise 반환
          // 상대방 앞으로 이동하기 (Tween 애니메이션 사용)
          pet.play('my-pet-walk')
          const tween = pet.scene.tweens.add({
            targets: pet, // 애니메이션 타겟 설정
            x: opponent.x - 150,  // 상대방 앞으로 이동
            y: opponent.y,
            ease: 'power2', // tween 애니메이션의 속도 제어
            duration: 1000, // 이동 시간 (1초)
            // 이동을 완료하면 실행
            onComplete: () => {
              pet.play('my-pet-attack') // 공격 애니메이션 실행
              myPetRope.setPosition(pet.x, pet.y);
              myPetRope.setVisible(true); // 채찍을 보이게 하기
              myPetRope.play('my-pet-attack-motion'); // 채찍 공격 모션 재현
              // 프레임이 갱신될 때마다 실행
              pet.on('animationupdate', (frame: Phaser.Animations.AnimationFrame) => {
                  const frameIndex = frame.index
                  // 애니메이션 프레임별로 채찍 위치 조정
                  if (frameIndex <= 2) {
                    myPetRope.setPosition(myPet.x, myPet.y)
                  } else {
                    myPetRope.setDepth(0) // 채찍이 상대 펫 앞에 위치
                    myPetRope.setPosition(myPet.x + 100, myPet.y + 20)
                    myPetRope.setDepth(2) // 채찍을 다시 펫 뒤로
                  }
                })
              // 내 펫의 공격 애니메이션이 완료하면 실행
              pet.on('animationcomplete-my-pet-attack', () => {
                myPetRope.setVisible(false);
                pet.play('my-pet-walk') // 펫은 다시 걷는 모션
                resolve();  // 공격이 완료되었음을 알림
              })
            }
          })
        })
      }

      // 공격 명령을 실행하는 함수
      const executeAttack = async () => {
        // 한 명이라도 공격이 선택되지 않으면 실행하지 않는다.
        if (!selectedAttack || !opponentAttack) return;
        
        // 선공권 결정
        const mySpeed = 10; // 우선 임의로 설정함
        const opponentSpeed = 5;
        
        if (mySpeed >= opponentSpeed) {
          // 내 펫이 선공
          await AttackOpponent(myPet, opponentPet)
          // 체력 계산
          setOpponentHp((prevHp) => Math.max(prevHp - selectedAttack.damage, 0));
          // 공격을 마무리했으니 공격 선택 삭제
          setSelectedAttack(null)
          // 상대방이 쓰러지면 승자 표시
          if (opponentHp - selectedAttack.damage <= 0) {
            // 여기에 이제 상대방 기절로 바꿈
            // opponentPet.frame()
            console.log('기절 떠야지')
            opponentPetStunMark.setVisible(true)  // 기절 마크 표시
            opponentPetStunMark.play('opponent-pet-stun-bird')  // 상대방 머리 위에 기절 표시
            // 애니메이션 완료 후 승자 설정
            myPetStunMark.on('animationcomplete', () => {
              setWinner('USER456');  // 내 기절 애니메이션 완료 후 승자 설정
            });
            return; // 상대방은 반격을 못 함
          }
          // 상대방의 반격
          setTimeout(() => {
            // 상대 공격 로직 추가 필요...
            setMyHp((prevHp) => Math.max(prevHp - opponentAttack.damage, 0));
            setOpponentAttack(null)
            // 내 체력이 다 해서 쓰러지면
            if (myHp - opponentAttack.damage <= 0) {
              // 여기에 내 기절 프레임으로 변경
              // myPet.frame()
              console.log('여기도 기절 떠야지')
              myPetStunMark.setVisible(true)  // 기절 마크 표시
              myPetStunMark.play('my-pet-stun-bird')  // 내 머리 위에 기절 표시
              setWinner('USER456');
              return;
            }
          }, 1000)
        } else {
          // 상대방 선공
          setTimeout(async () => {
            setMyHp((prevHp) => Math.max(prevHp - opponentAttack.damage, 0));
            setOpponentAttack(null)
            if (myHp - opponentAttack.damage <= 0) {
              // 여기에 내 기절 프레임으로 변경
              // myPet.frame()
              myPetStunMark.play('my-pet-stun-bird')
              setWinner('USER456');
              return;
            }
            // 내 펫의 반격
            setTimeout(async () => {
              setOpponentHp((prevHp) => Math.max(prevHp - selectedAttack.damage, 0));
              if (opponentHp - selectedAttack.damage <= 0) {
                // opponentPet.frame()
                opponentPetStunMark.play('opponent-pet-stun-bird')
                setWinner('USER123');
                return
              }
            })
          }, 1000);
        }
      }
    
      // 공격이 모두 선택되면 상대를 공격
      if (selectedAttack && opponentAttack) {
        executeAttack()
      }
    }
    
    // 프레임별 업데이트 함수 (현재는 빈 상태)
    function update() {}

    return () => {
      // 씬을 파괴할 때 메모리 해제를 위해 true 사용
      game.destroy(true); 
    };
    // 아래의 배열의 요소의 변수 값이 변하면 다시 렌더링한다.
  }, [dvw, dvh, myHp, opponentHp, isBattleInProgress, selectedAttack, opponentAttack, setWinner, setSelectedAttack, setOpponentAttack]);

  return <div ref={gameContainerRef} className="border-4 border-black round-lg" style={{ width: '100%', height: '40vh' }} />;
};

export default PhaserGame;