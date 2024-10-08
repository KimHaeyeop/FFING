import React, { useEffect } from "react";
import randomMatchService from "../websocket/randomMatchService"; // WebSocket 로직을 포함한 서비스 파일
import WebSocketClient from "../websocket/websocketClient";

interface RandomMatchingProps {
  isOpen: boolean;
  onClose: () => void;
  myUserId: string;
}

const RandomMatching: React.FC<RandomMatchingProps> = ({ isOpen, onClose, myUserId }) => {
  useEffect(() => {
    if (isOpen) {
      console.log("랜덤 매칭 오픈됐어요~~");
      const client = WebSocketClient.getInstance();

      // wsClient.subscribe(`/sub/battle/ready/${userId}`, (message) => {
      //   const data = JSON.parse(message.body);
      //   setOpponentInfo(data);
      //   console.log('상대방 정보:', data);
      // });

      // 랜덤 매칭 요청
      if (client.isConnectedStatus) {
        randomMatchService.requestRandomMatch(myUserId, 100); // 예시로 1000의 스탯을 보냄

        // 매칭 성공 시 콜백 함수
        randomMatchService.subscribeToMatchReady(myUserId, (matchData) => {
          console.log("매칭 성공:", matchData);
          // 매칭 성사 후 처리 로직
        });
      }

      return () => {
        // 매칭 취소
        randomMatchService.cancelRandomMatch(myUserId);
      };
    }
  }, [isOpen, myUserId]);

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>랜덤 매칭 중...</h2>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
  ) : null;
};

export default RandomMatching;
