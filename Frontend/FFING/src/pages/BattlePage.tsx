import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PhaserGame from '../components/Game/PhaserGame';
import AttackSelection from '../components/Game/AttackSelection';
import AttackResult from '../components/Game/AttackResult';
import DisplayWinner from '../components/Game/DisplayWinner';
import GameResult from '../components/Game/DisplayResult';
import randomMatchService from '../websocket/randomMatchService';  // randomMatchService 불러오기
import { useAuthStore } from '../store/authStore';
import { useMatchStore } from '../store/matchStore';
import WebSocketClient from '../websocket/websocketClient';
import { useLocation } from 'react-router-dom';

interface AttackOption {
  name: string;
  damage: number;
}

const BattlePage: React.FC = () => {
  // const { infos } = useLocation().state as { infos: PlayerInfo }; // useNavigate를 통해 가져온 데이터를 사용
  // console.log(infos)


  const { matchId } = useParams<{ matchId: string }>();
  const { myInfo, opponentInfo } = useMatchStore();
  const [selectedAttack, setSelectedAttack] = useState<{ name: string; damage: number; damageStatus: string; } | null>(null);
  const [opponentAttack, setOpponentAttack] = useState<{ name: string; damage: number; damageStatus: string; } | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [showGameResult, setShowGameResult] = useState<boolean>(false);
  
  const [myPetUrl, setMyPetUrl] = useState<string>('/pets/default.png');  // 기본 이미지 설정
  const [opponentPetUrl, setOpponentPetUrl] = useState<string>('/pets/default.png');
  const userId = useAuthStore((state) => state.userId);

  // 내 공격 리스트
  const myAttackOptions: AttackOption[] = myInfo?.stats.map((damage, index) => ({
    name: ['금융', '식비', '생활/문화', '교통', '쇼핑'][index],
    damage: damage,
  })) || [];

  // 상대 공격 리스트
  const opponentAttackOptions: AttackOption[] = opponentInfo?.stats.map((damage, index) => ({
    name: ['금융', '식비', '생활/문화', '교통', '쇼핑'][index],
    damage: damage,
  })) || [];

  const [myPetInfo, setMyPetInfo] = useState<any>(null);
  const [opponentPetInfo, setOpponentPetInfo] = useState<any>(null);

  useEffect(() => {
    const client = WebSocketClient.getInstance();

    const setupWebSocket = async (myUserId: number) => {
      try {
        if (!client.isConnectedStatus()) {
          await client.waitForConnect();
        }

        // 배틀 진행 중인 데이터 구독
        client.subscribe(`/sub/battle/playing/${matchId}`, (message) => {
          const result = JSON.parse(message.body);
          console.log("배틀 진행 중 데이터 수신:", result);
          if (result.pet1Info.petInfoId === myInfo?.petInfoId) {
            setMyPetInfo(result.pet1Info);
            setOpponentPetInfo(result.pet2Info);
          } else {
            setMyPetInfo(result.pet2Info);
            setOpponentPetInfo(result.pet1Info);
          }
        });

        // 나와 상대방의 펫 정보를 가져오는 구독
        randomMatchService.subscribeToMatchReady(myUserId, (message) => {
          const result = JSON.parse(message.body);
          console.log("펫 정보 수신:", result);

          // 나와 상대방의 petCode로 각각의 이미지 경로를 설정
          setMyPetUrl(`/pets/${result.myPetInfo.petCode}.png`);
          setOpponentPetUrl(`/pets/${result.opponentPetInfo.petCode}.png`);
        });

      } catch (error) {
        console.error("웹소켓 연결 실패:", error);
      }
    };

    setupWebSocket(userId || 1);

    return () => {
      client.disconnect();
    };
  }, [matchId, userId]);

  useEffect(() => {
    if (opponentPetInfo) {
      setOpponentAttack({
        name: opponentAttackOptions[opponentPetInfo.attackNum].name,
        damage: opponentPetInfo.damageDealt,
        damageStatus: opponentPetInfo.damageStatus,
      });
    }
  }, [opponentPetInfo]);

  // 공격 선택 함수
  const handleAttackSelect = (attackName: string) => {
    const selected = myAttackOptions.find((attack) => attack.name === attackName);
    if (selected) {
      setSelectedAttack({
        name: selected.name,
        damage: selected.damage,
        damageStatus: 'ready',
      });

      const client = WebSocketClient.getInstance();
      client.publish(`/pub/battle/${matchId}`, {
        matchId: matchId,
        petInfoId: myInfo?.petInfoId,
        petAttackNum: myAttackOptions.indexOf(selected),
      });
    }
  };

  // 승자가 결정되면 3초 후 GameResult 표시
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
          <span className="ml-4">{opponentInfo?.nickname}</span>
        </div>
        {/* Phaser 게임 컨테이너 */}
        <PhaserGame 
          selectedAttack={selectedAttack}
          opponentAttack={opponentAttack}
          setSelectedAttack={setSelectedAttack}
          setOpponentAttack={setOpponentAttack}
          setWinner={setWinner}
          myHp1={myPetInfo?.hp || 100}
          opponentHp1={opponentPetInfo?.hp || 100}
        />
        {/* 공격 선택 컴포넌트 */}
        <div className="mt-2">
          {winner ? (
            showGameResult ? (
              <GameResult winner={winner} />
            ) : (
              <div onClick={handleDisplayWinnerClick}>
                <DisplayWinner winner={winner} />
              </div>
            )
          ) : selectedAttack ? (
            <AttackResult selectedAttack={selectedAttack} opponentAttack={opponentAttack} />
          ) : (
            <AttackSelection attackOptions={myAttackOptions} onSelectAttack={handleAttackSelect} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
