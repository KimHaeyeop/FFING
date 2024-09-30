import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(true);
  // const [isReady, setIsReady] = useState(false); // 내 준비
  const [opponentInfo, setOpponentInfo] = useState<PlayerInfo | null>(null); // 상대방 정보
  const [myInfo, setMyInfo] = useState<PlayerInfo>({
    nickname: 'myNickName',
    petType: 'petType',
    recentMatches: ['승', '패', '승', '패', '승']
  });

  useEffect(() => {
    console.log(myInfo);
    const socket = new WebSocket('ws://websocket-server-url');

    // 매칭 페이지 넘어오면 소켓 연결 시작
    socket.onopen = () => {
      // 매칭 시작시 내 정보 같이 보냄
      socket.send(JSON.stringify({
        type: 'PLAYER_INFO',
        data: myInfo,
      }));
      console.log(myInfo);
    };

    // 소켓으로 메시지 수신했을 때
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // 적 정보가 들어오면 매칭된 것
      if (message.type === 'OPPONENT_INFO') {
        setOpponentInfo(message.data);
      }
    };

    return () => {
      // 소켓 닫고 새로운 소켓으로 연결
      socket.close();
    };
  }, [myInfo, navigate]);

  const handleFindOpponent = () => {
    setIsSearching(!isSearching);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl mb-4">대전 상대 찾기</h1>
      {!isSearching ? (
        // 버튼을 누르면 
        <button
          onClick={handleFindOpponent}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          대전 상대 찾기
        </button>
      ) : (
        <p>대전 상대를 찾는 중...</p>
      )}
    </div>
  );
};

export default MatchingPage;
