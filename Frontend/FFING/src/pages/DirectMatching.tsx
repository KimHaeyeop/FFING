import React, { useState, useEffect } from "react";
import directMatchService from "../websocket/directMatchService"; // WebSocket 로직을 포함한 서비스 파일

interface DirectMatchingProps {
  isOpen: boolean;
  onClose: () => void;
  myUserId: string;
}

const DirectMatching: React.FC<DirectMatchingProps> = ({ isOpen, onClose, myUserId }) => {
  const [opponentNickname, setOpponentNickname] = useState("");

  // 매칭 요청 핸들러
  const handleRequestMatch = () => {
    // 상대방 닉네임에 해당하는 유저 아이디를 가져와 매칭 요청
    directMatchService.requestDirectMatch(myUserId, opponentNickname);
  };

  useEffect(() => {
    if (isOpen) {
      // 직접 매칭 요청에 대한 응답 구독
      directMatchService.subscribeToDirectMatchRequest(myUserId, (matchData) => {
        console.log("초대 매칭 요청:", matchData);
        // 매칭 성사 처리 로직
      });

      return () => {
        // 매칭 취소 시 구독 해제
      };
    }
  }, [isOpen, myUserId]);

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>친구 초대</h2>
        <input
          type="text"
          value={opponentNickname}
          onChange={(e) => setOpponentNickname(e.target.value)}
          placeholder="상대방 닉네임 입력"
        />
        <button onClick={handleRequestMatch}>초대하기</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
  ) : null;
};

export default DirectMatching;
