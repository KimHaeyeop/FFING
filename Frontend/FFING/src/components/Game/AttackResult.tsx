import React, { useEffect } from 'react';

interface AttackResultProps {
  selectedAttack: {
    name: string;
    damage: number;
  },
  opponentAttack: {
    name: string;
    damage: number;
  } | null;
}

const AttackResult: React.FC<AttackResultProps> = ({ selectedAttack, opponentAttack }) => {

  return (
    <div className="flex flex-col items-center justify-center">
      {/* 내가 선택한 공격 */}
      <div className="w-full max-w-md mx-auto p-4 border-4 border-black rounded-lg bg-[#FAF7E1]">
        <div className="flex justify-between items-center p-2 mb-2">
          <div className="flex items-center">
            <span className="text-lg">{selectedAttack.name}</span>
          </div>
          <span className="text-lg text-gray-700">{selectedAttack.damage}</span>
        </div>
      </div>

      {/* 상대방이 선택한 공격 */}
      <div className="w-full max-w-md mx-auto p-4 border-4 border-black rounded-lg bg-[#EEFFF0] mt-4">
        {opponentAttack ? (
          <div className="flex justify-between items-center p-2 mb-2">
            <div className="flex items-center">
              <span className="text-lg">{opponentAttack.name}</span>
            </div>
            <span className="text-lg text-gray-700">{opponentAttack.damage}</span>
          </div>
        ) : (
          // 상대방이 아직 선택하지 않았을 때
          <div className="text-center text-lg">waiting...</div>
        )}
      </div>
    </div>
  );
};

export default AttackResult;