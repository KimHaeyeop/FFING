import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/LoginApi';  // 로그인 API 호출
import { useAuthStore } from '../store/authStore';
import axios from '../api/AxiosConfig';

const LoginPage: React.FC = () => {

  // const login3 = async () => {
  //   const response3 = await axios.get('/user/test', {
  //   });
  //   console.log(response3);
  // }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth); // zustand에서 setAuth 가져옴

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // 에러 초기화

    try {
      // LoginApi.ts에서 정의한 login 함수를 호출
      const { accessToken, user } = await login(email, password);
      // console.log('accessToken:', accessToken);

      // 로그인 성공 후 토큰 저장
      localStorage.setItem('ACCESS_TOKEN', accessToken);
      // console.log(localStorage);

      // Zustand에 사용자 정보 저장
      setAuth(user.username, user.nickname);
      // console.log("Username:", user.username);
      // console.log("Nickname:", user.nickname);

      // login3();
      navigate('/'); // 페이지 이동 로직
    } catch (error: any) {
      // 에러 메시지 설정
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">로그인</h2>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="아이디"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
