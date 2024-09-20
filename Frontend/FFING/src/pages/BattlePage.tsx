import React, { useState } from 'react';
import Phaser from '../components/Game/PetPhaser.tsx';
import AttackSelection from '../components/Game/AttackSelection';

const BattlePage: React.FC = () => {
  const [currentAnimation, setCurrentAnimation] = useState<'idle' | 'attack' | 'damaged' | 'move'>('idle');

  const handleAttackSelect = (attackName: string) => {
    // 공격 선택 시 'attack' 애니메이션을 재생하고 나중에 상태에 따라 'damaged' 등을 설정할 수 있음
    setCurrentAnimation('attack');
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {/* 실제 전투가 이루어지는 페이저 화면 */}
      <div className="w-full h-1/2">
        <Phaser animationState={currentAnimation} />
      </div>

      {/* 공격 선택 컴포넌트 */}
      <div className="w-full h-1/2">
        <AttackSelection onSelectAttack={handleAttackSelect} />
      </div>
    </div>
  );
};

export default BattlePage;
