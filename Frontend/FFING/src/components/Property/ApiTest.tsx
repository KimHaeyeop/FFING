import React, { useState, useEffect } from 'react';
import { getTotalAsset } from '../../api/AssetApi'; // assetApi 파일을 가져옴

const ApiTest: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // API 호출 테스트 함수
  const testApiCalls = async () => {
    try {
      // 예시로 get1 호출 (ssafyUserId가 필요함)
      const response1 = await getTotalAsset('1');
      console.log('Response:', response1);
      
      // 응답 데이터를 state에 저장
      setData(response1.data);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 API 호출 실행
    testApiCalls();
  }, []);

  // 로딩 중 처리
  if (!data && !error) {
    return <div>Loading...</div>;
  }

  // 에러 처리
  if (error) {
    return <div>Error occurred: {error}</div>;
  }

  // API 응답 결과 출력
  return (
    <div>
      <h1>API Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ApiTest;
