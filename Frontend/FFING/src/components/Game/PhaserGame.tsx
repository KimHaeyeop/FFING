import React, { useEffect, useRef, Dispatch, SetStateAction } from 'react';
import Phaser from 'phaser';
import useViewportStore from '../../store/useViewportStore';
// 우선 펫과 배경 시트는 임의로 지정, 나중에 연동해야겠지?
import myPetSpriteSheet from '/pets/cat-green.png';
import opponentPetSpriteSheet from '/pets/man-arab.png';
import battleBackground from '/backgrounds/battle-background.png';


// battlePage에서 받는 props 요소
interface PhaserGameProps {
  selectedAttack: { name: string; damage: number } | null;
  opponentAttack: { name: string; damage: number } | null;
  setSelectedAttack: (attack: { name: string; damage: number } | null) => void;
  setOpponentAttack: (attack: { name: string; damage: number } | null) => void;
  setWinner: (winner: string) => void;
}

// 타입을 지정하기 위한 interface 정의
interface PetRefs {
  name: string;
  x: number;  // 펫의 x축 위치
  range: number; // 펫이 상대 펫 기준 얼마나 떨어져야 하는지
  pet: React.MutableRefObject<Phaser.GameObjects.Sprite | null>;
  rope: React.MutableRefObject<Phaser.GameObjects.Sprite | null>;
  stunMark: React.MutableRefObject<Phaser.GameObjects.Sprite | null>;
  hpFill: React.MutableRefObject<Phaser.GameObjects.Graphics | null>;
}

// 게임판 객체
const PhaserGame: React.FC<PhaserGameProps> = ({ selectedAttack, opponentAttack, setSelectedAttack, setOpponentAttack, setWinner }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null); // HTML DOM 요소를 참조하기 위한 ref
  const { dvw, dvh } = useViewportStore();  // 화면 뷰포트 크기 관리 (동적으로 화면 크기를 변경하기 위해 사용)
  const [myMaxHp, setMyMaxHp] = React.useState<number>(10); // 내 펫의 최대 체력, 기본값 10(임시)
  const [myHp, setMyHp] = React.useState<number>(myMaxHp); // 내 펫의 현재 체력, 기본값 10(임시)
  const [opponentMaxHp, setOpponentMaxHp] = React.useState<number>(10); // 상대 펫의 최대 체력, 기본값 10(임시)
  const [opponentHp, setOpponentHp] = React.useState<number>(opponentMaxHp); // 상대 펫의 현재 체력, 기본값 10(임시)

  // 속도는 임시로 정함(추후에 선공 계산 로직 추가)
  const mySpeed = 10
  const opponentSpeed = 5

  // 움직이는 배경 설정
  const backgroundRef = useRef<Phaser.GameObjects.TileSprite | null>(null)

  // 내 펫 관련 요소를 참조하는 딕셔너리
  const myPetRefs: PetRefs = {
    name: 'my-pet',
    x: dvw * 20,
    range: -150,
    pet: useRef<Phaser.GameObjects.Sprite | null>(null),
    rope: useRef<Phaser.GameObjects.Sprite | null>(null),
    stunMark: useRef<Phaser.GameObjects.Sprite | null>(null),
    hpFill: useRef<Phaser.GameObjects.Graphics | null>(null)
  }
  
  // 상대 펫 관련 요소를 참조하는 딕셔너리
  const opponentPetRefs: PetRefs = {
    name: 'opponent-pet',
    x: dvw * 80,
    range: 150,
    pet: useRef<Phaser.GameObjects.Sprite | null>(null),
    rope: useRef<Phaser.GameObjects.Sprite | null>(null),
    stunMark: useRef<Phaser.GameObjects.Sprite | null>(null),
    hpFill: useRef<Phaser.GameObjects.Graphics | null>(null)
  }

  // 상대방으로 이동하는 함수
  function moveToOpponent (attacker: PetRefs, defender: PetRefs) {
    return new Promise<void> ((resolve) => {
      attacker.pet.current?.play(`${attacker.name}-walk`);  // 걷기 모션
      const tween = attacker.pet.current?.scene.tweens.add({
        targets: attacker.pet.current, // 애니메이션 타겟 설정
        x: defender.pet.current!.x + attacker.range,  // 상대방 앞으로 이동
        y: defender.pet.current!.y,
        ease: 'Power1 ', // tween 애니메이션의 속도 제어
        duration: 1000, // 이동 시간 (1초)
        onComplete: () => {
          resolve()
        }
      });
    })
  }
  
  // 상대방을 공격하는 함수
  function attackOpponent (attacker: PetRefs, damage: number, setHp: Dispatch<SetStateAction<number>>) {
    return new Promise<void> ((resolve) => {
      // 애니메이션 완료마다 체력을 계산하고 이벤트 리스너를 제거하여 턴이 지날 때마다 중복 호출을 제어하는 함수
      const onAnimationComplete = () => {
        setHp((prevHp) => Math.max(prevHp - damage, 0))
        attacker.pet.current?.off('animationcomplete', onAnimationComplete); // 이벤트 리스너 제거
        resolve()
      }

      attacker.pet.current?.play(`${attacker.name}-attack`);  // 휘두르는 모션
      attacker.rope.current?.setPosition(attacker.pet.current!.x - attacker.range , attacker.pet.current!.y); // 채찍 위치 조정 필요
      attacker.rope.current?.setVisible(true); // 채찍이 보이고
      attacker.rope.current?.play(`${attacker.name}-rope-motion`); // 채찍의 모션
      // 휘두르는 모션이 끝나면 종료
      attacker.pet.current?.on('animationcomplete', onAnimationComplete); // 이벤트 리스너 제거
    })
  }
    
  // 전투에서 복귀하는 함수
  function moveToBase (attacker: PetRefs) {
    return new Promise<void> ((resolve) => {
      attacker.rope.current?.setVisible(false);
      attacker.pet.current?.play(`${attacker.name}-walk`);
      const tween = attacker.pet.current?.scene.tweens.add({
        targets: attacker.pet.current, // 애니메이션 타겟 설정
        x: attacker.x,  // 내 원래 위치로 이동
        y: attacker.pet.current!.y,
        ease: 'Linear', // tween 애니메이션의 속도 제어
        duration: 1000, // 이동 시간 (1초)
        onComplete: () => {
          attacker.pet.current?.play(`${attacker.name}-idle`);  // 다시 기본폼으로
          resolve()
        }
      })
    })
  }

  // 전투(한 턴)을 수행하는 함수
  async function petFight (attacker: PetRefs, defender: PetRefs, damage: number, setHp: Dispatch<SetStateAction<number>>) {
      // 단계적으로 함수를 수행하고 모두 완료하면 전투 상태 해제
      await moveToOpponent(attacker, defender)  // 접근
      await attackOpponent(attacker, damage, setHp)  // 공격
      await moveToBase(attacker)  // 복귀
    }
    
  useEffect(() => {
    if (!gameContainerRef.current) return;  // ref가 초기화되지 않았으면 실행하지 않음

    // Phaser 게임 설정 객체 (config)
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,  // Phaser가 CANVAS나 WEBGL 중 자동으로 선택함
      width: dvw * 100, // 뷰포트 너비에 맞춰 게임 캔버스 크기 설정
      height: '100%',
      backgroundColor: "#FFFFFF",  // 배경색을 검정색으로 설정
      parent: gameContainerRef.current || undefined, // Phaser 게임이 렌더링될 HTML DOM 요소 (gameContainerRef)
      // 오디오 차단
      audio: {
        disableWebAudio: true,
      },
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
      // const background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
      // background.setOrigin(0.5, 0.5); // 이미지의 중심을 기준으로 배치
      // background.setDisplaySize(this.scale.width, this.scale.height); // 배경 이미지를 화면 크기에 맞춤
      
      const background = this.add.tileSprite(this.scale.width / 2, this.scale.height / 2, 0, 0, 'background').setOrigin(0.5, 0.5);  // 배경을 움직일 수 있게 tileSprite로
      background.setDisplaySize(this.scale.width, this.scale.height); // 배경 이미지를 화면 크기에 맞춤
      backgroundRef.current = background

      // 내 펫 스프라이트 추가
      const myPet = this.add.sprite(dvw*20, this.scale.height - 100, 'mypet');
      myPet.setScale(1);
      myPet.setDepth(1)
      myPetRefs.pet.current = myPet  // 외부에서 참조할 수 있게 할당

      // 내 펫의 채찍(무기) 생성
      const myPetRope = this.add.sprite(myPet.x, myPet.y, 'mypet')
      myPetRope.setVisible(false);  // 채찍은 공격할 때만 보이게 기본적으로 숨긴다.
      myPetRefs.rope.current = myPetRope

      // 내 펫 기절 시 기절 아이콘 생성
      const myPetStunMark = this.add.sprite(myPet.x, myPet.y - 50, 'mypet')
      myPetStunMark.setVisible(false) // 기절 모션은 기절할 때만 보여야 한다.
      myPetRefs.stunMark.current = myPetStunMark

      // 상대 펫 스프라이트 추가
      const opponentPet = this.add.sprite(dvw*80, this.scale.height - 100, 'opponentpet');
      opponentPet.flipX = true; // 스프라이트 좌우 반전
      opponentPet.setScale(1);
      opponentPetRefs.pet.current = opponentPet
      
      // 상대 펫의 채찍 생성
      const opponentPetRope = this.add.sprite(opponentPet.x, opponentPet.y, 'opponentpet')
      opponentPetRope.flipX = true;
      opponentPetRope.setVisible(false);
      opponentPetRefs.rope.current = opponentPetRope

      // 상대 펫 기절 시 기절 아이콘 생성
      const opponentPetStunMark = this.add.sprite(opponentPet.x, opponentPet.y - 50, 'opponentpet')
      opponentPetStunMark.flipX = true;
      opponentPetStunMark.setVisible(false);
      opponentPetRefs.stunMark.current = opponentPetStunMark

      // 내 펫 체력바 생성
      const myHpBar = this.add.graphics();
      myHpBar.fillStyle(0x000000, 1); 
      myHpBar.fillRoundedRect(myPet.x - 50, myPet.y - 100, 100, 20, 10);  // (x위치, y위치, 가로 길이, 세로 길이, ?) 설정

      // 내 펫 체력 표시
      const myHpFill = this.add.graphics();
      myHpFill.fillStyle(0xff0000, 1);
      myHpFill.fillRoundedRect(myPet.x - 50, myPet.y - 100, myHp / myMaxHp * 100, 20, 10);
      myPetRefs.hpFill.current = myHpFill

      // 상대방 전체 체력 생성하기
      const opponentHpBar = this.add.graphics();
      opponentHpBar.fillStyle(0x000000, 1);
      opponentHpBar.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, 100, 20, 10);

      // 상대방 현재 체력 생성하기
      const opponentHpFill = this.add.graphics();
      opponentHpFill.fillStyle(0xff0000, 1);
      opponentHpFill.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, opponentHp / opponentMaxHp * 100, 20, 10);
      opponentPetRefs.hpFill.current = opponentHpFill

      // 애니메이션 설정 (펫의 idle 상태)
      this.anims.create({
        key: 'my-pet-idle',
        frames: this.anims.generateFrameNumbers('mypet', { start: 128, end: 129 }),
        frameRate: 1, // 1초에 1프레임 재생 속도
        repeat: -1  // 무한 반복
      });
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
        key: 'my-pet-rope-motion',
        frames: this.anims.generateFrameNumbers('mypet', { start: 202, end: 207 }),
        frameRate: 10,
        repeat: 0,
      })

      this.anims.create({
        key: 'opponent-pet-attack',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 64, end: 69 }),
        frameRate: 10,
        repeat: 0,
      })

      this.anims.create({
        key: 'opponent-pet-rope-motion',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 202, end: 207 }),
        frameRate: 10,
        repeat: 0,
      })

      this.anims.create({
        key: 'my-pet-stun-bird',
        frames: this.anims.generateFrameNumbers('mypet', { start: 208, end: 219 }),
        frameRate: 10,
        repeat: -1,
      })

      this.anims.create({
        key: 'opponent-pet-stun-bird',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 208, end: 219 }),
        frameRate: 10,
        repeat: -1,
      })
    }
    
    // 프레임별 업데이트 함수 (현재는 빈 상태)
    function update() {
      if (backgroundRef.current) {
        backgroundRef.current!.tilePositionX -= 0.01
      }
    }

    return () => {
      // 씬을 파괴할 때 메모리 해제를 위해 true 사용
      game.destroy(true); 
    };
    // 아래의 배열의 요소의 변수 값이 변하면 다시 렌더링한다.
  }, []);
  
  // 공격을 수행하는 함수
  useEffect(() => {
  // 이하의 모든 요소가 null이 아님은 검정했으므로 !를 써도 무방하다.
  if (selectedAttack &&
    opponentAttack &&
    myPetRefs.pet.current &&
    opponentPetRefs.pet.current &&
    myPetRefs.rope.current &&
    opponentPetRefs.rope.current &&
    myPetRefs.stunMark.current &&
    opponentPetRefs.stunMark.current
  ) {
      (async () => {
          if (mySpeed > opponentSpeed) {
            // 내 공격 -> 상대 공격
            await petFight(myPetRefs, opponentPetRefs, selectedAttack.damage, setOpponentHp)
            if (opponentHp - selectedAttack.damage > 0) {
              await petFight(opponentPetRefs, myPetRefs, opponentAttack.damage, setMyHp)
            }
            setSelectedAttack(null) // 내 공격 삭제
            setOpponentAttack(null) // 상대 공격 삭제
          } else {
          // 상대 공격 -> 내 공격
            await petFight(opponentPetRefs, myPetRefs, opponentAttack.damage, setOpponentHp)
            if (myHp - opponentAttack.damage > 0) {
              await petFight(myPetRefs, opponentPetRefs, selectedAttack.damage, setMyHp)
            }
            setOpponentAttack(null)
            setSelectedAttack(null)
          } 
        }) ()
      }
    }, [selectedAttack, opponentAttack]);
  
  // 체력 계산 및 전투 종료를 검정하는 함수
  useEffect(() => {
    // myHp가 변경될 때마다 체력바 업데이트
    if (myPetRefs.hpFill.current && myPetRefs.pet.current) {
      myPetRefs.hpFill.current.clear();  // 체력 초기화
      myPetRefs.hpFill.current.fillStyle(0xff0000, 1); //빨간색으로 채워라
      myPetRefs.hpFill.current.fillRoundedRect(myPetRefs.pet.current!.x - 50, myPetRefs.pet.current!.y - 100, (myHp / myMaxHp) * 100, 20, 10); // 크기 재설정
    }
    // 내 체력이 0일 때
    if (myHp === 0) {
      myPetRefs.hpFill.current?.clear()  // 깔끔한 디자인을 위해 삭제
      myPetRefs.stunMark.current?.setVisible(true)  // 스턴 모션이 모이고
      myPetRefs.stunMark.current?.play(`${myPetRefs.name}-stun-bird`)  // 기절 애니메이션 반복
      myPetRefs.pet.current?.stop()  // 기존 애니메이션 중지
      myPetRefs.pet.current?.setFrame(9) // 펫은 납작 엎드리기
      setWinner('opponent')  // 실제 사용자의 닉네임으로 추후 수정해야 함
    }
  }, [myHp])

  // 체력 계산 및 전투 종료를 검정하는 함수
  useEffect(() => {
    // opponentHp가 변경될 때마다 체력바 업데이트
    if (opponentPetRefs.hpFill.current && opponentPetRefs.pet.current) {
      opponentPetRefs.hpFill.current.clear();  // 체력 초기화
      opponentPetRefs.hpFill.current.fillStyle(0xff0000, 1); //빨간색으로 채워라
      opponentPetRefs.hpFill.current.fillRoundedRect(opponentPetRefs.pet.current!.x - 50, opponentPetRefs.pet.current!.y - 100, (opponentHp / opponentMaxHp) * 100, 20, 10); // 크기 재설정
    }
    // 상대 체력이 0일 때
    if (opponentHp === 0) {
      opponentPetRefs.hpFill.current?.clear()  // 깔끔한 디자인을 위해 삭제
      opponentPetRefs.stunMark.current?.setVisible(true)  // 스턴 모션이 모이고
      opponentPetRefs.stunMark.current?.play(`${opponentPetRefs.name}-stun-bird`)  // 기절 애니메이션 반복
      opponentPetRefs.pet.current?.stop()  // 기존 애니메이션 중지
      opponentPetRefs.pet.current?.setFrame(9) // 펫은 납작 엎드리기
      setWinner('me')  // 실제 사용자의 닉네임으로 추후 수정해야 함
    }
  }, [opponentHp])
  
  return <div ref={gameContainerRef} className="round-lg" style={{ width: '100vw', height: '45vh' }} />;
}

export default PhaserGame;