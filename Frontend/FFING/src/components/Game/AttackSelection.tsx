import React, { useState } from 'react';
import { mdiTriangle } from '@mdi/js';
import Icon from '@mdi/react';

interface AttackOption {
  name: string;
  damage: number;
}

const attackOptions: AttackOption[] = [
  // 지금은 데미지 임의로 설정
  { name: '금융', damage: Math.floor(Math.random() * 10) + 1 },
  { name: '식비', damage: Math.floor(Math.random() * 10) + 1 },
  { name: '생활/문화', damage: Math.floor(Math.random() * 10) + 1 },
  { name: '교통', damage: Math.floor(Math.random() * 10) + 1 },
  { name: '쇼핑', damage: Math.floor(Math.random() * 10) + 1 },
];

const PetAttackChoice: React.FC = () => {
  const [selectedAttack, setSelectedAttack] = useState<string | null>(null);

  const handleAttackSelect = (attackName: string) => {
    setSelectedAttack(attackName);
  };

  return (
    // 필요에 따라서 너비 수정해야 할 수도 
    <div className="w-full max-w-md mx-auto p-4 border-4 border-black rounded-lg bg-white">
      {attackOptions.map((attack) => (
        <div
          key={attack.name}
          className={`flex justify-between items-center p-2 mb-2 border-b-2 border-gray-300 ${
            selectedAttack === attack.name ? 'bg-gray-200' : ''
          }`}
          onClick={() => handleAttackSelect(attack.name)}
        >
          <div className="flex items-center">
            {/* 선택된 공격 왼쪽에 삼각형 표시 */}
            {selectedAttack === attack.name && (
              <Icon path={mdiTriangle} size={1} className="rotate-90"/>
              // <div className="mr-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-black"></div>
            )}
            &emsp;&emsp;
            <span className="text-lg">{attack.name}</span>
          </div>
          {/* 공격 데미지 표시 */}
          <span className="text-lg text-gray-700 mr-4">{attack.damage}</span>
        </div>
      ))}
      {/* API를 통해 데미지 정보를 가져올 부분 */}
      {/* 추후 API를 통해 공격 데미지 정보를 받아와 설정하는 로직 추가 예정 */}
    </div>
  );
};

export default PetAttackChoice;
