import React, { useState } from 'react';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // 에러 초기화

    try {
      const response = await axios.post('/auth/signin', {
        email,
        password
      });
      console.log(response.data);

      if (response.status === 200) {
        console.log('로그인 성공!', response.data);
        // 로그인 성공 후 로직 (예: 토큰 저장 및 페이지 리다이렉트)
        // localStorage.setItem('token', response.data.token);
        // navigate('/dashboard'); // 성공 후 페이지 이동
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setError('아이디 또는 비밀번호가 잘못되었습니다.');
      } else {
        setError('로그인 중 오류가 발생하였습니다.');
      }
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
