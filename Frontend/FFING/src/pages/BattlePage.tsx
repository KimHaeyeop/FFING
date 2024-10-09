import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PhaserGame from '../components/Game/PhaserGame';
import AttackSelection from '../components/Game/AttackSelection';
import AttackResult from '../components/Game/AttackResult';
import DisplayWinner from '../components/Game/DisplayWinner';
import GameResult from '../components/Game/DisplayResult';
import WebSocketClient from '../websocket/websocketClient';
import { useAuthStore } from '../store/authStore';
import { useMatchStore } from '../store/matchStore';

interface AttackOption {
  name: string;
  damage: number;
}

const BattlePage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { myInfo, opponentInfo } = useMatchStore();
  const [selectedAttack, setSelectedAttack] = useState<AttackOption | null>(null);  // 내가 선택한 공격
  const [opponentAttack, setOpponentAttack] = useState<{ name: string; damage: number } | null>(null);  // 상대가 선택한 공격
  const [winner, setWinner] = useState<string | null>(null);  // 승리자
  const [showGameResult, setShowGameResult] = useState<boolean>(false);  // GameResult 표시 여부

  // 선택 가능한 모든 공격, 데미지는 임시로 지정
  const attackOptions: AttackOption[] = myInfo?.stats.map((damage, index) => ({
    name: ['금융', '식비', '생활/문화', '교통', '쇼핑'][index],  // 공격 이름 배열
    damage: damage,
  })) || [];  // myInfo가 없을 경우 빈 배열로 초기화

  useEffect(() => {
    const client = WebSocketClient.getInstance();

    console.log("내정보", myInfo);

    // 웹소켓 연결 대기 및 구독 설정
    const setupWebSocket = async () => {
      try {
        if (!client.isConnectedStatus()) {
          await client.waitForConnect();
        }

        client.subscribe(`/sub/battle/playing/${matchId}`, (message) => {
          const result = JSON.parse(message.body);
          console.log("상대 공격 수신:", result);
          setOpponentAttack(result.opponentAttack);
          setWinner(result.winner);
        });
      } catch (error) {
        console.error("웹소켓 연결 실패:", error);
      }
    };

    setupWebSocket();

    return () => {
      client.disconnect();
    };
  }, [matchId]);

  // 공격을 선택하면 상대방이 임의로 공격을 선택하게 하는 함수 -> socket 연결 되면 없어질 함수
  const handleAttackSelect = (attackName: string) => {
    const selected = attackOptions.find((attack) => attack.name === attackName);
    if (selected) {
      setSelectedAttack(selected);

      const client = WebSocketClient.getInstance();

      client.publish(`/pub/battle/${matchId}`, {
        matchId: matchId,
        petInfoId: myInfo?.petInfoId, // 임의의 사용자 ID, 실제로는 인증된 사용자 ID를 사용
        petAttackNum: attackOptions.indexOf(selected),
      });


      console.log(`공격 전송: ${selected.name}`);
    }
  };

  // 승자가 결정되면 3초 후에 GameResult를 표시
  useEffect(() => {
    if (winner) {
      const timer = setTimeout(() => {
        setShowGameResult(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [winner]);

  // DisplayWinner 클릭 시 GameResult 표시
  const handleDisplayWinnerClick = () => {
    setShowGameResult(true);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-screen h-screen">
        {/* 닉네임 */}
        <div className="flex justify-center items-center text-xm font-bold my-2 h-[5dvh]">
          <span className="mr-4">{myInfo?.nickname}</span>
          <span className="mx-4">vs</span>
          <span className="ml-4">상대닉네임</span>
        </div>
        {/* Phaser 게임 컨테이너 */}
        <PhaserGame 
          selectedAttack={selectedAttack}
          opponentAttack={opponentAttack}
          setSelectedAttack={setSelectedAttack}
          setOpponentAttack={setOpponentAttack}
          setWinner={setWinner}
        />
       {/* 공격 선택 컴포넌트 */}
       <div className="mt-2">
        {/* 랭킹 변동, 네이게이터를 보여주는 컴포넌트 */}
          {winner ? (
            showGameResult ? (
              <GameResult 
                winner={winner}                 
              />
            ) : (
              // 승자를 보여주는 컴포넌트
              <div onClick={handleDisplayWinnerClick}>
                <DisplayWinner winner={winner} />
              </div>
            )
          ) : selectedAttack ? (
            // 선택 결과를 보여주는 컴포넌트
            <AttackResult selectedAttack={selectedAttack} opponentAttack={opponentAttack}/> // 승자가 결정되지 않고, 모두 공격을 선택했을 때
          ) : (
            // 공격을 결정하는 컴포넌트
            <AttackSelection attackOptions={attackOptions} onSelectAttack={handleAttackSelect} /> // 승자가 결정되지 않고, 모두 공격을 선택하지 않았을 때
          )}
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
