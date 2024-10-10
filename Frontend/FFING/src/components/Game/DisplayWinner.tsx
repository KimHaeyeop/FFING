import React from 'react';

interface DisplayWinnerProps {
  winner: string;
}

const DisplayWinner: React.FC<DisplayWinnerProps> = ({ winner }) => {
  const backgroundColor = winner === 'me' ? '#FAF7E1' : '#EEFFF0';
  return (
    <div className={`w-full max-w-lg mx-auto p-8 border-4 border-black rounded-lg bg-[${backgroundColor}] flex flex-col justify-center items-center`}>
      {/* 승리 텍스트 */}
      <span className="text-3xl font-galmuri-11-bold mb-4">You</span>
      {winner === 'me' ? (
        <span className="text-3xl font-galmuri-11-bold">Win!</span>
      ) : (
        <span className="text-3xl font-galmuri-11-bold">Lose!</span>
      )}
    </div>
  );
};

export default DisplayWinner;
