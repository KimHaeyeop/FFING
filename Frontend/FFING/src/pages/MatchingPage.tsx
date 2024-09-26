import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FindOpponentPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const handleFindOpponent = () => {
    setIsSearching(true);
    // 임의의 대기 시간 후에 대전 상대를 찾았다고 가정하고 BattlePage로 이동
    // 여기서 소켓 통신을 통해서 완료하면 이동할 수 있게 한다.
    setTimeout(() => {
      navigate('/battle');
    }, 2000); // 2초 대기
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl mb-4">대전 상대 찾기</h1>
      {!isSearching ? (
        // 버튼을 누르면 큐를 잡는다.
        <button
          onClick={handleFindOpponent} 
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          대전 상대 찾기
        </button>
      ) : (
        <p>대전 상대를 찾는 중...</p>
      )}
    </div>
  );
};

export default FindOpponentPage;
