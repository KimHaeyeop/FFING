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
    const startRandomMatch = async () => {
      if (isOpen) {
        console.log("랜덤 매칭 오픈됐어요~~");
        const client = WebSocketClient.getInstance();

        try {
          await client.waitForConnect();
          console.log("웹소켓 연결 완료 후 매칭 요청");

          // 매칭 성공 시 콜백 함수
          randomMatchService.subscribeToMatchReady(myUserId, (matchData) => {
            console.log("매칭 성공:", matchData.body);
            // 매칭 성사 후 처리 로직

          });
          // 매칭 요청
          randomMatchService.requestRandomMatch(myUserId, 100);
          randomMatchService.requestRandomMatch('3', 100);

        } catch (error) {
          console.error("웹소켓 연결 실패:", error);
        }
      }
    };

    startRandomMatch();

    return () => {
      // 매칭 취소
      randomMatchService.cancelRandomMatch(myUserId);
    };
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
