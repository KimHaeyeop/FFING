import React, { useState } from 'react';
import GameBar from '../components/Game/GameBar';
import NavBar from '../components/Common/Navbar';
import PhaserGame from '../components/Game/PhaserGame';
import AttackSelection from '../components/Game/AttackSelection';
import AttackResult from '../components/Game/AttackResult';
import DisplayWinner from '../components/Game/DisplayWinner';

const BattlePage: React.FC = () => {
  const [selectedAttack, setSelectedAttack] = useState<{ name: string; damage: number } | null>(null);
  const [opponentAttack, setOpponentAttack] = useState<{ name: string; damage: number } | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const setOpponentAttackRandomly = () => {
    return {
      name: '쇼핑',
      damage: 1,
    };
  };

  const handleAttackSelect = (attackName: string) => {
    const attackOptions = [
      { name: '금융', damage: 0 },
      { name: '식비', damage: 1 },
      { name: '생활/문화', damage: 5 },
      { name: '교통', damage: 7 },
      { name: '쇼핑', damage: 10 },
    ];
    const selected = attackOptions.find((attack) => attack.name === attackName);
    if (selected) {
      setSelectedAttack(selected);
      setOpponentAttack(setOpponentAttackRandomly());
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
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
        <PhaserGame selectedAttack={selectedAttack} opponentAttack={opponentAttack} setWinner={setWinner} />
        {/* 공격 선택 컴포넌트 */}
        <div className="mt-2">
          {winner ? (
            <DisplayWinner winner={winner} />
          ) : selectedAttack ? (
            <AttackResult selectedAttack={selectedAttack} opponentAttack={opponentAttack}/>
          ) : (
            <AttackSelection onSelectAttack={handleAttackSelect} />
          )}
        </div>
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>
  );
};

export default BattlePage;
