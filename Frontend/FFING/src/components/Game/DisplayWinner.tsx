import React from 'react';

const DisplayWinner: React.FC = () => {
  const winnerNickname = 'USER456'; // 추후 승자 공식을 통해 동적으로 받아올 예정

  return (
    <div className="w-full max-w-lg mx-auto p-8 border-4 border-black rounded-lg bg-[#EEFFF0] flex flex-col justify-center items-center">
      {/* 승자 닉네임 */}
      <span className="text-3xl font-galmuri-11-bold mb-4">{winnerNickname}</span>

      {/* 승리 텍스트 */}
      <span className="text-3xl font-galmuri-11-bold">Win!</span>
    </div>
  );
};

export default DisplayWinner;
