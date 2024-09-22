import React from 'react';

const DisplayWinner: React.FC = ({ winner }) => {

  return (
    <div className="w-full max-w-lg mx-auto p-8 border-4 border-black rounded-lg bg-[#EEFFF0] flex flex-col justify-center items-center">
      {/* 승자 닉네임 */}
      <span className="text-3xl font-galmuri-11-bold mb-4">{winner}</span>

      {/* 승리 텍스트 */}
      <span className="text-3xl font-galmuri-11-bold">Win!</span>
    </div>
  );
};

export default DisplayWinner;
