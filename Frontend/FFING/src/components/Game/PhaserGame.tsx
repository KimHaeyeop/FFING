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
  const [myMaxHp, setMyMaxHp] = React.useState<number>(10); // 내 펫의 최대 체력, 기본값 10(임시)
  const [myHp, setMyHp] = React.useState<number>(myMaxHp); // 내 펫의 최대 체력, 기본값 10(임시)
  const [opponentMaxHp, setOpponentMaxHp] = React.useState<number>(10); // 상대 펫의 최대 체력, 기본값 10(임시)
  const [opponentHp, setOpponentHp] = React.useState<number>(opponentMaxHp); // 상대 펫의 현재 체력, 기본값 10(임시)
  const [isBattleInProgress, setIsBattleInProgress] = React.useState<boolean>(false); // 전투 진행 여부를 관리 (승리자를 표시할 때 사용됨)

  // 이하는 게임 내부의 요소를 참조하는 변수
  const myPetRef = useRef<Phaser.GameObjects.Sprite | null>(null);
  const opponentPetRef = useRef<Phaser.GameObjects.Sprite | null>(null);
  const myPetRopeRef = useRef<Phaser.GameObjects.Sprite | null>(null);
  const opponentPetRopeRef = useRef<Phaser.GameObjects.Sprite | null>(null);
  const myPetStunMarkRef = useRef<Phaser.GameObjects.Sprite | null>(null);
  const opponentPetStunMarkRef = useRef<Phaser.GameObjects.Sprite | null>(null);


  // 상대방으로 이동하는 함수
  function moveToOpponent () {
    return new Promise<void> ((resolve) => {
      myPetRef.current?.play('my-pet-walk');  // 걷기 모션
      const tween = myPetRef.current?.scene.tweens.add({
        targets: myPetRef.current, // 애니메이션 타겟 설정
        x: opponentPetRef.current!.x - 150,  // 상대방 앞으로 이동
        y: opponentPetRef.current!.y,
        ease: 'Power1 ', // tween 애니메이션의 속도 제어
        duration: 1000, // 이동 시간 (1초)
        onComplete: () => {
          resolve()
        }
      });
    })
  }
  
  // 상대방을 공격하는 함수
  function attackOpponent () {
    return new Promise<void> ((resolve) => {
      myPetRef.current?.play('my-pet-attack');  // 휘두르는 모션
      myPetRopeRef.current?.setPosition(myPetRef.current!.x, myPetRef.current!.y);
      myPetRopeRef.current?.setVisible(true); // 채찍이 보이고
      myPetRopeRef.current?.play('my-pet-rope-motion'); // 채찍의 모션
      // 휘두르는 모션이 끝나면 종료
      myPetRef.current?.on('animationcomplete', () => {
        resolve()
      })
    })
  }
    
  // 전투에서 복귀하는 함수
  function moveToBase () {
    return new Promise<void> ((resolve) => {
      myPetRopeRef.current?.setVisible(false);
      myPetRef.current?.play('my-pet-walk');
      const tween = myPetRef.current?.scene.tweens.add({
        targets: myPetRef.current, // 애니메이션 타겟 설정
        x: dvw*20,  // 내 원래 위치로 이동
        y: opponentPetRef.current!.y,
        ease: 'Linear', // tween 애니메이션의 속도 제어
        duration: 1000, // 이동 시간 (1초)
        onComplete: () => {
          myPetRef.current?.play('my-pet-idle');  // 다시 기본폼으로
          setSelectedAttack(null);  // 내 공격 삭제
          resolve()
        }
      })
    })
  }

  async function calcHp () {
    return new Promise<void> ((resolve) => {
      setOpponentHp((prevHp) => {
        const newHp = Math.max(prevHp - selectedAttack!.damage, 0);
        return newHp
        // 새로운 체력이 0이 되면
        // if (newHp === 0) {
        //   console.log(11)
        //   opponentPetRef.current?.setFrame(9) // 펫은 납작 엎드리기
        //   opponentPetStunMarkRef.current?.setVisible(true)  // 스턴 모션이 모이고
        //   opponentPetStunMarkRef.current?.play('opponent-pet-stun-bird')  // 기절 애니메이션 반복
        //   setWinner('USER456')  // 실제 사용자의 닉네임으로 추후 수정해야 함
        // }
        // return newHp
      })
      resolve()
    })
  }

  // 전투(한 턴)을 수행하는 함수
  async function petFight () {
    // 이미 전투가 진행 중이면 함수 종료
    if (isBattleInProgress) return
    setIsBattleInProgress(true)
    // 단계적으로 함수를 수행하고 모두 완료하면 전투 상태 해제
    try {
      await moveToOpponent()
      await attackOpponent()
      await moveToBase()
      await calcHp()
    } finally {
      setIsBattleInProgress(false)
    }
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
      const background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
      background.setOrigin(0.5, 0.5); // 이미지의 중심을 기준으로 배치
      background.setDisplaySize(this.scale.width, this.scale.height); // 배경 이미지를 화면 크기에 맞춤

      // 내 펫 스프라이트 추가
      const myPet = this.add.sprite(dvw*20, this.scale.height - 100, 'mypet');
      myPet.setScale(1);
      myPet.setDepth(1)
      myPetRef.current = myPet  // 외부에서 참조할 수 있게 할당

      // 내 펫의 채찍(무기) 생성
      const myPetRope = this.add.sprite(myPet.x, myPet.y, 'mypet')
      myPetRope.setVisible(false);  // 채찍은 공격할 때만 보이게 기본적으로 숨긴다.
      myPetRopeRef.current = myPetRope

      // 내 펫 기절 시 기절 아이콘 생성
      const myPetStunMark = this.add.sprite(myPet.x, myPet.y - 50, 'mypet')
      myPetStunMark.setVisible(false) // 기절 모션은 기절할 때만 보여야 한다.
      myPetStunMarkRef.current = myPetStunMark

      // 상대 펫 스프라이트 추가
      const opponentPet = this.add.sprite(dvw*80, this.scale.height - 100, 'opponentpet');
      opponentPet.flipX = true; // 스프라이트 좌우 반전
      opponentPet.setScale(1);
      opponentPetRef.current = opponentPet
      
      // 상대 펫의 채찍 생성
      const opponentPetRope = this.add.sprite(opponentPet.x, opponentPet.y, 'opponentpet')
      opponentPetRope.flipX = true;
      opponentPetRope.setVisible(false);
      opponentPetRopeRef.current = opponentPetRope

      // 상대 펫 기절 시 기절 아이콘 생성
      const opponentPetStunMark = this.add.sprite(opponentPet.x, opponentPet.y - 50, 'opponentpet')
      opponentPetStunMark.flipX = true;
      opponentPetStunMark.setVisible(false);
      opponentPetStunMarkRef.current = opponentPetStunMark

      // 내 펫 체력바 생성
      const myHpBar = this.add.graphics();
      myHpBar.fillStyle(0x000000, 1); 
      myHpBar.fillRoundedRect(myPet.x - 50, myPet.y - 100, 100, 20, 10);  // (x위치, y위치, 가로 길이, 세로 길이, ?) 설정

      // 내 펫 체력 표시
      const myHpFill = this.add.graphics();
      myHpFill.clear();
      myHpFill.fillStyle(0xff0000, 1);
      myHpFill.fillRoundedRect(myPet.x - 50, myPet.y - 100, myHp / myMaxHp * 100, 20, 10);

      // 상대방 전체 체력 생성하기
      const opponentHpBar = this.add.graphics();
      opponentHpBar.fillStyle(0x000000, 1);
      opponentHpBar.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, 100, 20, 10);

      // 상대방 현재 체력 생성하기
      const opponentHpFill = this.add.graphics();
      opponentHpFill.clear();
      opponentHpFill.fillStyle(0xff0000, 1);
      opponentHpFill.fillRoundedRect(opponentPet.x - 50, opponentPet.y - 100, opponentHp / opponentMaxHp * 100, 20, 10);

      // 애니메이션 설정 (펫의 idle 상태)
      this.anims.create({
        key: 'my-pet-idle',
        frames: this.anims.generateFrameNumbers('mypet', { start: 128, end: 129 }),
        frameRate: 1, // 1초에 1프레임 재생 속도
        repeat: -1  // 무한 반복
      });

      // 전투가 가능할 때만 전투 기본 상태 실행
      if (myHp > 0) {
        myPet.play('my-pet-idle');        
      }

      this.anims.create({
        key: 'opponent-pet-idle',
        frames: this.anims.generateFrameNumbers('opponentpet', { start: 128, end: 129 }),
        frameRate: 1,
        repeat: -1
      });

      // 전투가 가능할 때만 전투 기본 상태 실행
      if (opponentHp > 0) {
        console.log('뭐고')
        opponentPet.play('opponent-pet-idle');     
      }

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
    function update() {}

    return () => {
      // 씬을 파괴할 때 메모리 해제를 위해 true 사용
      game.destroy(true); 
    };
    // 아래의 배열의 요소의 변수 값이 변하면 다시 렌더링한다.
  }, []);
  
  // 공격을 수행하는 함수
  useEffect(() => {
  // 이하의 모든 요소가 null이 아님은 검정했으므로 !를 써도 무방하다.
  if (selectedAttack && opponentAttack && myPetRef.current && opponentPetRef.current && myPetRopeRef.current
    && opponentPetRopeRef.current && myPetStunMarkRef.current && opponentPetStunMarkRef.current) {
      petFight()
    }
  }, [selectedAttack, opponentAttack]);
  
  // 전투 종료를 검정하는 함수
  useEffect(() => {
    if (opponentHp === 0) {
      opponentPetStunMarkRef.current?.setVisible(true)  // 스턴 모션이 모이고
      opponentPetStunMarkRef.current?.play('opponent-pet-stun-bird')  // 기절 애니메이션 반복
      opponentPetRef.current?.stop()  // 기존 애니메이션 중지
      opponentPetRef.current?.setFrame(9) // 펫은 납작 엎드리기
      setWinner('USER456')  // 실제 사용자의 닉네임으로 추후 수정해야 함
    }
  }, [opponentHp])

  return <div ref={gameContainerRef} className="round-lg" style={{ width: '100vw', height: '45vh' }} />;
}

export default PhaserGame;