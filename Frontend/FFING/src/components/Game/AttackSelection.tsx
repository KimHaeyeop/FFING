import React from 'react';
import { mdiFoodForkDrink, mdiShopping, mdiTheater, mdiSubwayVariant, mdiFinance } from '@mdi/js';
import Icon from '@mdi/js';

interface AttackOption {
  name: string;
  damage: number;
}

interface AttackSelectionProps {
  attackOptions: AttackOption[];
  onSelectAttack: (attackName: string) => void;
}

const AttackSelection: React.FC<AttackSelectionProps> = ({ attackOptions, onSelectAttack }) => {

  const typeColorMap: { [key: string]: { background: string; icon: string } } =
  {
    식비: {
      background: "bg-red-100",
      icon: mdiFoodForkDrink,
    },
    쇼핑: {
      background: "bg-yellow-100",
      icon: mdiShopping,
    },
    생활: {
      background: "bg-green-100",
      icon: mdiTheater,
    },
    교통: {
      background: "bg-blue-100",
      icon: mdiSubwayVariant,
    },
    금융: {
      background: "bg-purple-100",
      icon: mdiFinance,
    },
  };
  
  // BattlePage에 선택한 공격을 emit하는 함수
  const handleAttackSelect = (attackName: string) => {
    onSelectAttack(attackName);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border-4 border-black rounded-lg bg-white">
      {/* 모든 가능한 공격 렌더링 -> 선택 시 공격 결정 */}
      {attackOptions.map((attack) => (
        <div
          key={attack.name}
          className={`flex justify-between items-center p-2 mb-2 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-100 transition ${typeColorMap[attack.name].background}`}
          onClick={() => handleAttackSelect(attack.name)}
        >
          {/* 공격 이름 */}
          <div className="flex items-center">
            <span className="text-xl">{attack.name}</span>
          </div>
          {/* 공격 데미지 */}
          <span className="text-xl text-gray-700 mr-4">{attack.damage}</span>
        </div>
      ))}
    </div>
  );
};

export default AttackSelection;
