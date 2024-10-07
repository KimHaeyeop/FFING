import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stomp, Client } from '@stomp/stompjs';

// 로딩 three-dots CSS
import 'three-dots/dist/three-dots.css';

const { VITE_WEBSOCKET_ENDPOINT } = import.meta.env

interface PlayerInfo {
  nickname: string;
  petType: string;
  recentMatches: string[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  myUserId: string;
  opponentUserId: string;
}

const MatchingPageModal: React.FC<ModalProps> = ({ isOpen, onClose, myUserId, opponentUserId }) => {
  const navigate = useNavigate();
  const [opponentInfo, setOpponentInfo] = useState<PlayerInfo | null>(null);
  const [myInfo, setMyInfo] = useState<PlayerInfo>({
    nickname: 'myNickName',
    petType: 'petType',
    recentMatches: ['승', '패', '승', '패', '승']
  });

  const stompClientRef = useRef<Client | null>(null);
  // const socketRef = useRef<WebSocket | null>(null);

  // const connect = () => {
  //   const socket = new WebSocket(VITE_WEBSOCKET_ENDPOINT)
  //   stompClientRef.current = Stomp.over(socket);
  //   stompClientRef.current?.connect({}, () => {
  //     stompClientRef.current?.subscribe(`/sub/chatroom/1`, (message) => {
  //       const newMessage = JSON.parse(message.body);
  //       setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     });
  //   });
  // };

  useEffect(() => {
    if (isOpen) {
      console.log('hi');
      const stompClient = new Client({
        brokerURL: VITE_WEBSOCKET_ENDPOINT,
        reconnectDelay: 5000,
        heartbeatIncoming: 100000, // 서버에서 클라이언트로 보내는 심장박동 간격
        heartbeatOutgoing: 100000, // 클라이언트에서 서버로 보내는 심장박동 간격
        onConnect: () => {
          console.log('STOMP Client connected');
  
          // 상대방 정보 받아올 구독 소켓
          stompClient.subscribe(`/sub/match/battle-request/${myUserId}`, (message) => {
            const data = JSON.parse(message.body);
            setOpponentInfo(data);
            console.log('상대방 정보:', data);
          });

          const matchRequest = {
            fromUserId: myUserId,
            toUserId: opponentUserId,
          };

          stompClient.publish({
            destination: '/pub/match/direct/request',
            body: JSON.stringify(matchRequest),
          });

          console.log('매칭 요청 전송:', matchRequest);
  
          // stompClient.subscribe(`/sub/match/battle-request/${myUserId}`, (message) => {
          //   console.log(message.body)
          //   const response = JSON.parse(message.body);
          //   console.log(response);
          // });
  
          // test용 발행
          // stompClient.publish({
          //   destination: '/pub/',
          // });
          
          // stompClient.publish({
          //   destination: '/pub/match/direct/request',
          //   body: JSON.stringify(directMatchReq),
          // });
  
        },
        onStompError: (frame) => {
          console.error('Broker error: ' + frame.headers['message']);
        },
        onWebSocketClose: (error) => {
          console.error('WebSocket closed: ', error)
        },
        onWebSocketError: (error) => {
          console.error('WebSocket error: ', error)
        },
      });

      stompClient.activate();

      stompClientRef.current = stompClient;
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
        console.log('STOMP Client disconnected');
      }
    };
  }, [isOpen, myUserId, opponentUserId]);

  const handleFindOpponent = () => {
    if (stompClientRef.current) {
      const matchRequest = {
        fromUserId: '1', // 요청 보내는 유저 id
        toUserId: '2' // 요청 받는 유저 id
      };

      stompClientRef.current.publish({
        destination: '/pub/match/direct/request',
        body: JSON.stringify(matchRequest),
      });

      console.log('매칭 요청 전송:', matchRequest);
    }
  };

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
            <div className="flex justify-center items-center">
            <div>대전 상대를 찾는 중...</div>
            {/* 로딩 three-dots */}
            <div className='dot-spin ml-4'/>
            </div>
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
