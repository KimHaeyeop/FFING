import React from 'react';
// import { format } from 'date-fns';

interface Ranking {
  rank: number;
  score: number;
  petImage: string;
  petName: string;
}

interface DisplayRankingProps {
  rankings: Ranking[];
  myRank: Ranking;
}

const DisplayRanking: React.FC<DisplayRankingProps> = ({ rankings, myRank }) => {
  // const currentMonth = format(new Date(), 'yyyy.MM');
  const currentMonth = '2024.09';

  // 랭킹에 따라 올바른 서수를 반환하는 함수
  const getOrdinalSuffix = (rank: number) => {
    const j = rank % 10,
          k = rank % 100;
    if (j === 1 && k !== 11) {
      return `${rank}st`;
    }
    if (j === 2 && k !== 12) {
      return `${rank}nd`;
    }
    if (j === 3 && k !== 13) {
      return `${rank}rd`;
    }
    return `${rank}th`;
  };

  return (
    <div>
      <h2>대전 순위 ({currentMonth})</h2>
      <div>
        {/* 랭킹, 점수, 이름 렌더링 */}
        {rankings.map((ranking, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{getOrdinalSuffix(ranking.rank)}</span>
            <span>{ranking.score}</span>
            <span>
              {/* <img src={ranking.petImage} alt={ranking.petName} className="inline-block w-8 h-8 mr-2" /> */} 
              {ranking.petName}
            </span>
          </div>
        ))}
      </div>
      {/* 내 정보 렌더링 */}
      <div className="mt-4">
        <h3>내 순위</h3>
        <div className="flex justify-between items-center">
          <span>{getOrdinalSuffix(myRank.rank)}</span>
          <span>{myRank.score}</span>
          <span>
            {/* <img src={myRank.petImage} alt={myRank.petName} className="inline-block w-8 h-8 mr-2" /> */}
            {myRank.petName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DisplayRanking;
