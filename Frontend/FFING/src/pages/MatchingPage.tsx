// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import NavBar from '../components/Common/Navbar';import TextHeader from '../components/Common/TextHeader';

// interface PlayerInfo {
//   nickname: string;
//   petType: string;
//   recentMatches: string[];
// }

// const MatchingPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [isSearching, setIsSearching] = useState(false);
//   // const [isReady, setIsReady] = useState(false); // 내 준비
//   const [opponentInfo, setOpponentInfo] = useState<PlayerInfo | null>(null); // 상대방 정보
//   const [myInfo, setMyInfo] = useState<PlayerInfo>({
//     nickname: 'myNickName',
//     petType: 'petType',
//     recentMatches: ['승', '패', '승', '패', '승']
//   });

//   const socketRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     console.log(myInfo);
//     if (isSearching) {
//       socketRef.current = new WebSocket('ws://websocket-server-url');

//       socketRef.current.onopen = () => {
//         socketRef.current?.send(
//           JSON.stringify({
//             type: 'PLAYER_INFO',
//             data: myInfo,
//           })
//         );
//         console.log('WebSoket opened and sent myInfo:', myInfo);
//       };

//       socketRef.current.onmessage = (event) => {
//         const message = JSON.parse(event.data);

//         if (message.type === 'OPPONENT_INFO') {
//           setOpponentInfo(message.data);
//         }
//       };

//       socketRef.current.onclose = () => {
//         console.log('WebSoket closed');
//       };
//     }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.close();
//         socketRef.current = null;
//         console.log('WebSocket instance cleared');
//       }
//     };
//   }, [isSearching, myInfo]);

//   const handleFindOpponent = () => {
//     setIsSearching(!isSearching);
//   };

//   return (
//     <div className="flex justify-center items-center">
//       <div className="w-screen h-screen">
//         <header>
//           <TextHeader title="매칭페이지" />
//         </header>
//         <div className="w-screen h-1/2">
//           내 정보
//         </div>

//         <h1 className="text-2xl mb-4">대전 상대 찾기</h1>
//         <button
//           onClick={handleFindOpponent}
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           대전 상대 찾기
//         </button>
//         {!isSearching ? (
//           // 버튼을 누르면 
//           <p>
//             대전 상대 찾기
//           </p>
//         ) : (
//           <p>대전 상대를 찾는 중...</p>
//         )}
//         <footer>
//           <NavBar />
//         </footer>
//       </div>
//     </div>

//   );
// };

// export default MatchingPage;

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import NavBar from '../components/Common/Navbar';
// import TextHeader from '../components/Common/TextHeader';

interface PlayerInfo {
  nickname: string;
  petType: string;
  recentMatches: string[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MatchingPageModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [opponentInfo, setOpponentInfo] = useState<PlayerInfo | null>(null);
  const [myInfo, setMyInfo] = useState<PlayerInfo>({
    nickname: 'myNickName',
    petType: 'petType',
    recentMatches: ['승', '패', '승', '패', '승']
  });

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (isOpen) {
      socketRef.current = new WebSocket('ws://websocket-server-url');

      socketRef.current.onopen = () => {
        socketRef.current?.send(
          JSON.stringify({
            type: 'PLAYER_INFO',
            data: myInfo,
          })
        );
        console.log('WebSocket opened and sent myInfo:', myInfo);
      };

      socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === 'OPPONENT_INFO') {
          setOpponentInfo(message.data);
        }
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket closed');
      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        console.log('WebSocket instance cleared');
      }
    };
  }, [isOpen, myInfo]);

  const handleReady = () => {
    console.log('Ready button clicked');
    navigate('/game/battle');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
        <header className="flex justify-between items-center">
          <h2 className="text-lg font-bold">매칭 중...</h2>
          <button onClick={onClose} className="text-red-500">닫기</button>
        </header>

        <div className='w-full h-1/2 mt-4'>
          {opponentInfo ? (
            <div>
              <h3 className='text-xl mb-2'>상대방 정보</h3>
                <p>닉네임: {opponentInfo.nickname}</p>
                <p>펫 타입: {opponentInfo.petType}</p>
                <p>최근 전적: {opponentInfo.recentMatches.join(', ')}</p>
            </div>
          ) : (
            <p>대전 상대를 찾는 중...</p>
          )}
        </div>
        {opponentInfo && (
          <button onClick={handleReady} className='px-4 py-2 bg-green-500 text-white rounded mt-4 w-full'>
            준비 완료
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchingPageModal;
