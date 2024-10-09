import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import randomMatchService from "../websocket/randomMatchService"; // WebSocket 로직을 포함한 서비스 파일
import WebSocketClient from "../websocket/websocketClient";
import { useAuthStore } from "../store/authStore";
import { useMatchStore } from "../store/matchStore";

interface RandomMatchingProps {
  isOpen: boolean;
  onClose: () => void;
  myUserId: number | null;
}

const RandomMatching: React.FC<RandomMatchingProps> = ({ isOpen, onClose, myUserId }) => {
  const { nickname } = useAuthStore();
  const { matchId, myInfo, opponentInfo, setMatchId, setMyInfo, setOpponentInfo, resetMatchInfo } = useMatchStore();
  const [isMatched, setIsMatched] = useState(false);
  const navigate = useNavigate();

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
            const data = JSON.parse(matchData.body);
            console.log("매칭 성공:", data);

            // 매칭 성사 후
            setMatchId(data.matchId);
            const { user1PetInfo, user2PetInfo } = data;
            // 닉네임 비교
            console.log("내 닉네임: ", nickname);
            // if (user1PetInfo.nickname === nickname) {
            //   setMyInfo(user1PetInfo);
            //   setOpponentInfo(user2PetInfo);
            // } else {
            //   setMyInfo(user2PetInfo);
            //   setOpponentInfo(user1PetInfo);
            // }
            if (user1PetInfo.nickname === nickname) {
              setMyInfo(user1PetInfo);
              setOpponentInfo(user2PetInfo);
            } else {
              setMyInfo(user2PetInfo);
              setOpponentInfo(user1PetInfo);
            }

            setIsMatched(true);

            setTimeout(() => {
              console.log("배틀페이지로 이동");
              navigate(`/game/battle/${data.matchId}`);
            }, 2000);
          });
          // 매칭 요청
          console.log(myUserId);
          randomMatchService.requestRandomMatch(myUserId, myInfo?.totalStat ?? 0);
          // console.log(matchId);

        } catch (error) {
          console.error("웹소켓 연결 실패:", error);
        }
      }
    };

    startRandomMatch();

    return () => {
      // 매칭 취소
      randomMatchService.cancelRandomMatch(myUserId);
      resetMatchInfo();
    };
  }, [isOpen, myUserId]);

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>랜덤 매칭 중...</h2>

        {isMatched ? (
          <div>
            <div>
              <h1>매치 아이디: {matchId}</h1>
              <h3>내 정보</h3>
              <p>닉네임: {myInfo?.nickname}</p>
              <p>승리 횟수: {myInfo?.winCount}</p>
              <p>패배 횟수: {myInfo?.loseCount}</p>
              <p>총 스탯: {myInfo?.totalStat}</p>
              <p>스탯: {myInfo?.stats.join(", ")}</p>
            </div>

            <div>
              <h3>상대 정보</h3>
              <p>닉네임: {opponentInfo?.nickname}</p>
              <p>승리 횟수: {opponentInfo?.winCount}</p>
              <p>패배 횟수: {opponentInfo?.loseCount}</p>
              <p>총 스탯: {opponentInfo?.totalStat}</p>
              <p>스탯: {opponentInfo?.stats.join(", ")}</p>
            </div>
          </div>
        ) : (
          <p>매칭 중...</p>
        )}

        <button onClick={onClose}>취소</button>
      </div>
    </div>
  ) : null;
};

export default RandomMatching;
