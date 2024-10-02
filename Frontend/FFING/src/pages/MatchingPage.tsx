import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Common/Navbar';
import GameBar from '../components/Game/GameBar';

interface PlayerInfo {
  nickname: string;
  petType: string;
  recentMatches: string[];
}

const MatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  // const [isReady, setIsReady] = useState(false); // 내 준비
  const [opponentInfo, setOpponentInfo] = useState<PlayerInfo | null>(null); // 상대방 정보
  const [myInfo, setMyInfo] = useState<PlayerInfo>({
    nickname: 'myNickName',
    petType: 'petType',
    recentMatches: ['승', '패', '승', '패', '승']
  });

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log(myInfo);
    if (isSearching) {
      socketRef.current = new WebSocket('ws://websocket-server-url');

      socketRef.current.onopen = () => {
        socketRef.current?.send(
          JSON.stringify({
            type: 'PLAYER_INFO',
            data: myInfo,
          })
        );
        console.log('WebSoket opened and sent myInfo:', myInfo);
      };

      socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === 'OPPONENT_INFO') {
          setOpponentInfo(message.data);
        }
      };

      socketRef.current.onclose = () => {
        console.log('WebSoket closed');
      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        console.log('WebSocket instance cleared');
      }
    };
  }, [isSearching, myInfo]);

  const handleFindOpponent = () => {
    setIsSearching(!isSearching);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        <header>
          <GameBar />
        </header>
        <div className="w-screen h-1/2">
          내 정보
        </div>

        <h1 className="text-2xl mb-4">대전 상대 찾기</h1>
        <button
          onClick={handleFindOpponent}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          대전 상대 찾기
        </button>
        {!isSearching ? (
          // 버튼을 누르면 
          <p>
            대전 상대 찾기
          </p>
        ) : (
          <p>대전 상대를 찾는 중...</p>
        )}
        <footer>
          <NavBar />
        </footer>
      </div>
    </div>

  );
};

export default MatchingPage;
