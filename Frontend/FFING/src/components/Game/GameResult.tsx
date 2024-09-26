import React from 'react';

interface GameResultProps {
  winner: string;
  score: number;
  rank: number;
  onRestart: () => void;
  onMain: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ winner, score, rank, onRestart, onMain }) => {
  const backgroundColor = winner === 'me' ? '#FAF7E1' : '#EEFFF0';

  return (
    <div
      className="w-full max-w-lg mx-auto p-8 border-4 border-black rounded-lg flex flex-col justify-center items-center"
      style={{ backgroundColor }}
    >
      <div className="flex w-full">
        {/* 점수와 랭킹 표시 */}
        <div className="w-1/2 flex flex-col items-center">
          <span className="text-2xl font-bold">Score: {score}</span>
          <span className="text-2xl font-bold">Rank: {rank}</span>
        </div>
        {/* 버튼들 */}
        <div className="w-1/2 flex flex-col items-center">
          <button
            className="w-full mb-2 p-2 bg-blue-500 text-white rounded"
            onClick={onMain}
          >
            메인으로
          </button>
          <button
            className="w-full p-2 bg-green-500 text-white rounded"
            onClick={onRestart}
          >
            다시하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
