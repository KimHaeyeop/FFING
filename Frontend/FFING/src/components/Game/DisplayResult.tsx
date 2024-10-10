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
          <div>
            <Link to="/main" className="flex-grow bg-[#FFD874] text-black p-2 rounded-lg font-bold">메인으로</Link>
          </div>
          <div>
            <Link to="/game" className="flex-grow bg-[#FFA1A1] text-black p-2 rounded-lg font-bold">다른 게임하기</Link>
          </div>
        </div>
        </div>
      </div>
  );
};

export default GameResult;
