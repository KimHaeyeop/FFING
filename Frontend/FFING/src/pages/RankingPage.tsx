import React from "react";
import GameBar from "../components/Game/GameBar";
import NavBar from "../components/Common/Navbar";
import DisplayRanking from "../components/Game/DisplayRanking";

const RankingPage: React.FC = () => {
  
  const rankings = [
    { rank: 1, score: 1234, petImage: 'pet1.png', petName: 'Fluffy' },
    { rank: 2, score: 1123, petImage: 'pet2.png', petName: 'Sparky' },
    { rank: 3, score: 1122, petImage: 'pet2.png', petName: '웃긴놈' },
    { rank: 4, score: 1121, petImage: 'pet2.png', petName: '이상한놈' },
    { rank: 5, score: 1111, petImage: 'pet2.png', petName: '못생긴놈' },
    { rank: 6, score: 1103, petImage: 'pet2.png', petName: '큰놈' },
    { rank: 7, score: 1021, petImage: 'pet2.png', petName: '작은놈' },
    { rank: 8, score: 945, petImage: 'pet2.png', petName: '멍청한놈' },
    // ... 8 more rankings
  ];

  const myRank = { rank: 15, score: 987, petImage: 'mypet.png', petName: 'Buddy' };

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="w-screen h-screen">
          {/* 읽지 않은 알람 표시와 링크를 제공하는 header */}
          <header>
            <GameBar />
          </header>
          {/* 이번 달 랭킹을 보여주는 컴포넌트 */}
          <div>
            <DisplayRanking rankings={rankings} myRank={myRank}/>
          </div>
          {/* 경로 이동을 제공하는 footer */}
          <footer>
            <NavBar />
          </footer>
        </div>
      </div>
    </>
  );
};

export default RankingPage;