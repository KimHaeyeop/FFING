import React, { useState } from 'react';
import GameBar from '../components/Game/GameBar';
import NavBar from '../components/Common/Navbar';
import PhaserGame from '../components/Game/PhaserGame';
import AttackSelection from '../components/Game/AttackSelection';
import AttackResult from '../components/Game/AttackResult';
import DisplayWinner from '../components/Game/DisplayWinner';

interface AttackOption {
  name: string;
  damage: number;
}

const BattlePage: React.FC = () => {
  const [selectedAttack, setSelectedAttack] = useState<{ name: string; damage: number } | null>(null);  // 내가 선택한 공격
  const [opponentAttack, setOpponentAttack] = useState<{ name: string; damage: number } | null>(null);  // 상대가 선택한 공격
  const [winner, setWinner] = useState<string | null>(null);  // 승리자

  // 상대의 공격은 임시로 쇼핑과 데미지 1로만
  const setOpponentAttackRandomly = () => {
    return {
      name: '쇼핑',
      damage: 1,
    };
  };

  // 선택 가능한 모든 공격, 데미지는 임시로 지정
  const attackOptions: AttackOption[] = [
    { name: '금융', damage: 0 },
    { name: '식비', damage: 1 },
    { name: '생활/문화', damage: 5 },
    { name: '교통', damage: 7 },
    { name: '쇼핑', damage: 10 },
  ];

  // 공격을 선택하면 상대방이 임의로 공격을 선택하게 하는 함수 -> socket 연결 되면 없어질 함수
  const handleAttackSelect = (attackName: string) => {
    const selected = attackOptions.find((attack) => attack.name === attackName);
    if (selected) {
      setSelectedAttack(selected);
      setTimeout(() => setOpponentAttack(setOpponentAttackRandomly()), 1500);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 게임 상단의 petfight와 알람을 표시하는 header */}
        <header>
          <GameBar />
        </header>
        {/* 닉네임 */}
        <div className="flex justify-center items-center text-xl font-bold my-2">
          <span className="mr-4">USER123</span>
          <span className="mx-4">vs</span>
          <span className="ml-4">USER456</span>
        </div>
        {/* Phaser 게임 컨테이너 */}
        <PhaserGame 
          selectedAttack={selectedAttack}
          opponentAttack={opponentAttack}
          setSelectedAttack={setSelectedAttack}
          setOpponentAttack={setOpponentAttack}
          setWinner={setWinner}
        />
        {/* 공격 선택 컴포넌트 */}
        <div className="mt-2">
          {winner ? (
            <DisplayWinner winner={winner} /> // 승지가 결정되었을 때
          ) : selectedAttack ? (
            <AttackResult selectedAttack={selectedAttack} opponentAttack={opponentAttack}/> // 승자가 결정되지 않고, 모두 공격을 선택했을 때
          ) : (
            <AttackSelection attackOptions={attackOptions} onSelectAttack={handleAttackSelect} /> // 승자가 결정되지 않고, 모두 공격을 선택하지 않았을 때
          )}
        </div>
        {/* 경로 이동을 제공하는 footer */}
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default BattlePage;
