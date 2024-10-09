import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/LoginApi";
import { useAuthStore } from "../store/authStore";
import FFING from "../assets/FFING.gif";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { accessToken, user } = await login(email, password);
      localStorage.setItem("ACCESS_TOKEN", accessToken);
      setAuth(user.nickname, user.userId, user.username);
      navigate("/main");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-white pt-32">
      <div className="w-full max-w-md bg-white">
        <div className="flex justify-center items-center w-full">
          <img src={FFING} alt="FFING Logo" className="w-48 h-48" />
        </div>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="아이디"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB300]"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB300]"
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="py-3 bg-[#CECECE] text-white rounded-md transition duration-300 font-galmuri-11-bold flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </>
            ) : (
              "로그인"
            )}
          </button>
          <span className="text-center text-[#686E74] cursor-pointer hover:underline">
            회원가입
          </span>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
