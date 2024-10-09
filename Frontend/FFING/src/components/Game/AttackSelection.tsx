// import React, { useState } from 'react';

// interface AttackOption {
//   name: string;
//   damage: number;
// }

// interface AttackSelectionProps {
//   attackOptions: AttackOption[];
//   onSelectAttack: (attackName: string) => void;
// }

// const AttackSelection: React.FC<AttackSelectionProps> = ({ attackOptions, onSelectAttack }) => {
//   // BattlePage에 선택한 공격을 emit하는 함수
//   const handleAttackSelect = (attackName: string) => {
//     onSelectAttack(attackName)
//   };

//   return (
//     // 기기마다 높이 수정이 필요할 것으로 사료됨
//     <div className="w-full max-w-md mx-auto p-4 border-4 border-black rounded-lg bg-white">
//       {/* 모든 가능한 공격 렌더링 -> 선택 시 공격 결정 */}
//       {attackOptions.map((attack) => (
//         <div
//           key={attack.name}
//           className="flex justify-between items-center p-2 mb-2 border-b-2 border-gray-300"
//           onClick={() => handleAttackSelect(attack.name)}
//         >
//           {/* 공격 이름 */}
//           <div className="flex items-center">
//             &emsp;&emsp;
//             <span className="text-lg">{attack.name}</span>
//           </div>
//           {/* 공격 데미지 */}
//           <span className="text-lg text-gray-700 mr-4">{attack.damage}</span>
//         </div>
//       ))}
//       {/* API를 통해 데미지 정보를 가져올 부분 */}
//       {/* 추후 API를 통해 공격 데미지 정보를 받아와 설정하는 로직 추가 예정 */}
//     </div>
//   );
// };

// export default AttackSelection;
import React from 'react';

interface AttackOption {
  name: string;
  damage: number;
}

interface AttackSelectionProps {
  attackOptions: AttackOption[];
  onSelectAttack: (attackName: string) => void;
}

const AttackSelection: React.FC<AttackSelectionProps> = ({ attackOptions, onSelectAttack }) => {
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
          className="flex justify-between items-center p-2 mb-2 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => handleAttackSelect(attack.name)}
        >
          {/* 공격 이름 */}
          <div className="flex items-center">
            <span className="text-lg">{attack.name}</span>
          </div>
          {/* 공격 데미지 */}
          <span className="text-lg text-gray-700 mr-4">{attack.damage}</span>
        </div>
      ))}
    </div>
  );
};

export default AttackSelection;
