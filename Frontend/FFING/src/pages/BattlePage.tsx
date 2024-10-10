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
  const [opponentAttack, setOpponentAttack] = useState<{ name: string; damage: number; damageStatus: string; } | null>(null);  // 상대가 선택한 공격
  const [winner, setWinner] = useState<string | null>(null);  // 승리자
  const [showGameResult, setShowGameResult] = useState<boolean>(false);  // GameResult 표시 여부

  // 내 공격 리스트
  const myAttackOptions: AttackOption[] = myInfo?.stats.map((damage, index) => ({
    name: ['금융', '식비', '생활/문화', '교통', '쇼핑'][index],  // 공격 이름 배열
    damage: damage,
  })) || [];  // myInfo가 없을 경우 빈 배열로 초기화

  // 상대 공격 리스트
  const opponentAttackOptions: AttackOption[] = opponentInfo?.stats.map((damage, index) => ({
    name: ['금융', '식비', '생활/문화', '교통', '쇼핑'][index],  // 공격 이름 배열
    damage: damage,
  })) || [];  // opponentInfo가 없을 경우 빈 배열로 초기화

  const [myPetInfo, setMyPetInfo] = useState<any>(null);
  const [opponentPetInfo, setOpponentPetInfo] = useState<any>(null);

  useEffect(() => {
    const client = WebSocketClient.getInstance();

    console.log("내정보", myInfo);

    // 웹소켓 연결 대기 및 구독 설정
    const setupWebSocket = async () => {
      try {
        if (!client.isConnectedStatus()) {
          console.log("연결이 안 되어 있네요");
          await client.waitForConnect();
        }
        // console.log("배틀 구독하겠습니다");
        client.subscribe(`/sub/battle/playing/${matchId}`, (message) => {
          const result = JSON.parse(message.body);
          console.log("상대 공격 수신:", result);

          if (result.pet1Info.petInfoId === myInfo?.petInfoId) {
            setMyPetInfo(result.pet1Info);
            setOpponentPetInfo(result.pet2Info);
          } else {
            setMyPetInfo(result.pet2Info);
            setOpponentPetInfo(result.pet1Info);
          }
          
          // setOpponentAttack({
          //   name: opponentAttackOptions[opponentPetInfo.attackNum].name,
          //   damage: opponentAttackOptions[opponentPetInfo.attackNum].damage,
          // });

          // console.log(opponentAttack?.name);
          // console.log(opponentAttack?.damage);

          // if (result.isFinished) {
          //   if (myPetInfo.isFirst) {
          //     setWinner(myPetInfo);
          //   } else {
          //     setWinner(opponentPetInfo);
          //   }
          // }


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

  useEffect(() => {
    if (opponentPetInfo) {
      setOpponentAttack({
        name: opponentAttackOptions[opponentPetInfo.attackNum].name,
        damage: opponentPetInfo.damageDealt,
        damageStatus: opponentPetInfo.damageStatus,
      });
    }
  }, [opponentPetInfo]); // opponentPetInfo가 업데이트될 때만 실행

  // 공격을 선택하면 상대방이 임의로 공격을 선택하게 하는 함수 -> socket 연결 되면 없어질 함수
  const handleAttackSelect = (attackName: string) => {
    const selected = myAttackOptions.find((attack) => attack.name === attackName);
    console.log(selected)
    if (selected) {
      setSelectedAttack(selected);

      const client = WebSocketClient.getInstance();

      client.publish(`/pub/battle/${matchId}`, {
        matchId: matchId,
        petInfoId: myInfo?.petInfoId,
        petAttackNum: myAttackOptions.indexOf(selected),
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
          <span className="ml-4">{opponentInfo?.nickname}</span>
        </div>
        {/* Phaser 게임 컨테이너 */}
        <PhaserGame 
          selectedAttack={selectedAttack}
          opponentAttack={opponentAttack}
          setSelectedAttack={setSelectedAttack}
          setOpponentAttack={setOpponentAttack}
          setWinner={setWinner}
          myHp1={myPetInfo?.hp? myPetInfo.hp : 100}
          opponentHp1={opponentPetInfo?.hp ? opponentPetInfo.hp : 100}
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
            <AttackSelection attackOptions={myAttackOptions} onSelectAttack={handleAttackSelect} /> // 승자가 결정되지 않고, 모두 공격을 선택하지 않았을 때
          )}
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
