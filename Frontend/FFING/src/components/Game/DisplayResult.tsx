import React from 'react';
import { Link } from 'react-router-dom';

interface GameResultProps {
  winner: string;
  // score: number;
  // rank: number;
}

const GameResult: React.FC<GameResultProps> = ({ winner }) => {
  const backgroundColor = winner === 'me' ? '#FAF7E1' : '#EEFFF0';

  return (
    <div
      className="w-full h-full max-w-lg mx-auto p-8 border-4 border-black rounded-lg"
      style={{ backgroundColor }}
    >
      <div className="rounded-lg overflow-hidden gap-2 max-w-screen-md mx-auto h-16 text-2xl font-galmuri-11-bold flex flex-col justify-center">
        <div className="flex justify-around">
          {/* 버튼들 */}
          <div className="flex-grow">
            <Link
              to="/main"
              className="block bg-[#FFD874] text-black p-2 rounded-lg font-bold text-center"
              style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
            >
              메인으로
            </Link>
          </div>
          <div className="flex-grow">
            <Link
              to="/game"
              className="block bg-[#FFA1A1] text-black p-2 rounded-lg font-bold text-center"
              style={{ whiteSpace: 'nowrap', minWidth: '100px' }}
            >
              다른 게임하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
