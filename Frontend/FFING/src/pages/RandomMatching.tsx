import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import randomMatchService from "../websocket/randomMatchService"; // WebSocket 로직을 포함한 서비스 파일
import WebSocketClient from "../websocket/websocketClient";
import { useAuthStore } from "../store/authStore";

interface RandomMatchingProps {
  isOpen: boolean;
  onClose: () => void;
  myUserId: number | null;
}

const RandomMatching: React.FC<RandomMatchingProps> = ({ isOpen, onClose, myUserId }) => {
  const { nickname } = useAuthStore();
  const [myInfo, setMyInfo] = useState<any>(null);
  const [opponentInfo, setOpponentInfo] = useState<any>(null);
  const [isMatched, setIsMatched] = useState(false);
  const [matchId, setMatchId] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(myInfo)
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
            console.log("매치아이디 ", data.matchId);

            // 매칭 성사 후
            setMatchId(data.matchId);
            const { user1PetInfo, user2PetInfo } = data;
            // 닉네임 비교
            console.log("내 닉네임: ", nickname);
            if (user1PetInfo.nickname === nickname) {
              setMyInfo(user1PetInfo);
              setOpponentInfo(user2PetInfo);
            } else {
              setMyInfo(user2PetInfo);
              setOpponentInfo(user1PetInfo);
            }
            // console.log("받은 닉네임: ", myInfo.nickname);

            setIsMatched(true);

            setTimeout(() => {
              navigate(`/game/battle/${data.matchId}`);
            }, 3000);
          });
          // 매칭 요청
          console.log(myUserId);
          randomMatchService.requestRandomMatch(myUserId, 100);
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
    };
  }, [isOpen, myUserId]);

  const handleReadyClick = () => {
    console.log("준비 완료!");
  };

  const renderStatComparison = (label: string, myStat: number, opponentStat: number) => {
    const maxStat = Math.max(myStat, opponentStat);
    const myPosition = (myStat / maxStat) * 100;
    const opponentPosition = (opponentStat / maxStat) * 100;


    return (
      <div className="mb-4">
        <p className="text-lg font-semibold">{label}</p>
        <div className="relative h-4 bg-gray-300 rounded">
          <div
            className="absolute top-0 h-4 bg-blue-500 rounded"
            style={{ width: `${myPosition}%` }}
          ></div>
          <div
            className="absolute top-0 h-4 bg-red-500 rounded"
            style={{ width: `${opponentPosition}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-blue-500">내 능력치: {myStat}</span>
          <span className="text-red-500">상대 능력치: {opponentStat}</span>
        </div>
      </div>
    );
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg">
        <h2 className="text-2xl font-bold mb-4">랜덤 매칭 중...</h2>

        {isMatched ? (
          <div className="bg-gray-200 p-4 rounded-lg">
            <div className="mb-4">
              {/* API 연동하면 좋을 것 같은데 */}
              <p className="font-galmuri-11-bold text-lg p-2">{myInfo?.nickname}</p>
              <div className="flex justify-center space-x-4">
                <p className="bg-[#C8E697] p-1 rounded-md text-sm">{myInfo?.winCount}승</p>
                <p className="bg-[#D23B8C] p-1 rounded-md text-white text-sm">{myInfo?.loseCount}패</p>
              </div>
              <p className="text-lg mt-2 font-galmuri-11-bold">{myInfo?.totalStat}</p>
            </div>  

            {myInfo?.stats.map((stat: number, index: number) => (
              renderStatComparison(`스탯 ${index + 1}`, stat, opponentInfo?.stats[index] || 0)
            ))}

            <div className="mb-4">
              <p className="font-galmuri-11-bold text-lg p-2">{opponentInfo?.nickname}</p>
              <div className="flex justify-center space-x-4">
                <p className="bg-[#C8E697] p-1 rounded-md text-sm">{opponentInfo?.winCount}승</p>
                <p className="bg-[#D23B8C] p-1 rounded-md text-white text-sm">{opponentInfo?.loseCount}패</p>
              </div>
              <p className="text-lg mt-2 font-galmuri-11-bold">{opponentInfo?.totalStat}</p>
            </div>

            <button 
              onClick={handleReadyClick} 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              준비 완료
            </button>
          </div>
        ) : (
          <p className="text-center text-lg">매칭 중...</p>
        )}

        <button 
          onClick={onClose} 
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          취소
        </button>
      </div>
    </div>
  ) : null;
};

export default RandomMatching;
