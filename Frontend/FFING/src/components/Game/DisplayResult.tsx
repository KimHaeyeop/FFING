import React from 'react';
import { Link } from 'react-router-dom';

interface GameResultProps {
  winner: string;
  score: number;
  rank: number;
}

const GameResult: React.FC<GameResultProps> = ({ winner, score, rank }) => {
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
          <Link to="/">메인으로</Link>
          <Link to="/battle">다시하기</Link>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
