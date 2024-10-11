import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PhaserGame from '../components/Game/PhaserGame';
import AttackSelection from '../components/Game/AttackSelection';
import AttackResult from '../components/Game/AttackResult';
import DisplayWinner from '../components/Game/DisplayWinner';
import GameResult from '../components/Game/DisplayResult';
import { useAuthStore } from '../store/authStore';
import { useMatchStore } from '../store/matchStore';
import WebSocketClient from '../websocket/websocketClient';
import useViewportStore from '../store/useViewportStore';

interface AttackOption {
  name: string;
  damage: number;
}

const BattlePage: React.FC = () => {
  // const { infos } = useLocation().state as { infos: PlayerInfo }; // useNavigate를 통해 가져온 데이터를 사용
  // console.log(infos)

  const { dvw, dvh } = useViewportStore(); // Zustand에서 동적 뷰포트 크기 가져오기
  const { matchId } = useParams<{ matchId: string }>();
  const { myInfo, opponentInfo } = useMatchStore();
  const [selectedAttack, setSelectedAttack] = useState<{ name: string; damage: number; damageStatus: string } | null>(null);
  const [opponentAttack, setOpponentAttack] = useState<{ name: string; damage: number; damageStatus: string; isFirst: boolean; } | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [showGameResult, setShowGameResult] = useState<boolean>(false);
  const userId = useAuthStore((state) => state.userId);

  // 추가: isFirst와 damageStatus를 상태로 저장
  // const [isFirst, setIsFirst] = useState<boolean>(false); 
  // const [damageStatus, setDamageStatus] = useState<string>('Normal'); 

  // 내 공격 리스트
  const myAttackOptions: AttackOption[] = myInfo?.stats.map((damage, index) => ({
    name: ['금융', '식비', '생활', '쇼핑', '교통'][index],  // 공격 이름 배열
    damage: damage,
  })) || [];

  // 상대 공격 리스트
  const opponentAttackOptions: AttackOption[] = opponentInfo?.stats.map((damage, index) => ({
    name: ['금융', '식비', '생활', '쇼핑', '교통'][index],  // 공격 이름 배열
    damage: damage,
  })) || [];

  const [myPetInfo, setMyPetInfo] = useState<any>(null);
  const [opponentPetInfo, setOpponentPetInfo] = useState<any>(null);

  useEffect(() => {
    const client = WebSocketClient.getInstance();

    const setupWebSocket = async () => {
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
            // setIsFirst(result.pet1Info.first); // 첫 번째 공격 여부 설정
            // setDamageStatus(result.pet1Info.damageStatus); // 데미지 상태 설정
          } else {
            setMyPetInfo(result.pet2Info);
            setOpponentPetInfo(result.pet1Info);
            // setIsFirst(result.pet2Info.first); // 첫 번째 공격 여부 설정
            // setDamageStatus(result.pet2Info.damageStatus); // 데미지 상태 설정
          }
        });

      } catch (error) {
        console.error("웹소켓 연결 실패:", error);
      }
    };

    setupWebSocket();

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
        isFirst: opponentPetInfo.first,
      });
    }
  }, [opponentPetInfo]);

  useEffect(() => {
    if (myPetInfo) {
      setSelectedAttack({
        name: myAttackOptions[myPetInfo.attackNum].name,
        damage: myPetInfo.damageDealt,
        damageStatus: myPetInfo.damageStatus,
      });
    }
  }, [myPetInfo]);

  // 공격 선택 함수
  const handleAttackSelect = (attackName: string) => {
    const selected = myAttackOptions.find((attack) => attack.name === attackName);
    if (selected) {
      setSelectedAttack({
        name: selected.name,
        damage: selected.damage,
        damageStatus: 'Normal',
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
        <div className="flex justify-center items-center text-xm font-galmuri-11-bold my-2" style={{height: dvh * 5}}>
          <span className="mr-4">{myInfo?.nickname}</span>
          <span className="mx-4">vs</span>
          <span className="ml-4">{opponentInfo?.nickname}</span>
        </div>
        <div style={{height: dvh * 44}}>
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
        </div>
        {/* 공격 선택 컴포넌트 */}
        <div style={{height: 51 * dvh}} className='bg-zinc-600 flex items-center'>
          <div className='mx-auto w-full'>
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
              <div >
                <AttackSelection attackOptions={myAttackOptions} onSelectAttack={handleAttackSelect} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
