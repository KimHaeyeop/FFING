import axios from 'axios';

axios.defaults.withCredentials = true;  // 요청에 자격 증명 포함
axios.defaults.baseURL = import.meta.env.VITE_SERVER_ENDPOINT;  // 기본 URL을 환경 변수에서 가져옴

// const refreshAccessToken = async () => {
//   try {
//     const response = await axios.post('/auth/reissue', {}, {
//       withCredentials: true
//     });
//     console.log("호출 되냐??");

//     const newAccessToken = response.headers.authorization;
//     localStorage.setItem("ACCESS_TOKEN", newAccessToken);
//     return newAccessToken;
//   } catch (error) {
//     console.error("Failed to refresh access token:", error);
//     localStorage.removeItem("ACCESS_TOKEN");
//     document.cookie = "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     window.location.href = '/login'; // 로그인을 요구하는 페이지로 리디렉션
//     throw error;
//   }
// };

// axios.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("ACCESS_TOKEN");
//     // console.log("토큰호출", token);
//     // console.log("localStorage 내용:", localStorage);
//     if (token) {
//       // console.log("토큰false인데 실행되나?", token);
//       config.headers.Authorization = `${token}`; // Bearer 토큰 형식으로 설정
//       // console.log("식별자", config.headers.Authorization);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axios.interceptors.response.use(
//   (response) => response, // 정상 응답 그대로 반환
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) { // 401 에러 처리
//       originalRequest._retry = true; // 재시도를 위한 플래그 설정
//       try {
//         const newAccessToken = await refreshAccessToken(); // 새로운 액세스 토큰을 요청

//         if (newAccessToken) {
//           console.log("accessToken 재발급 받음");
//           console.log("새 accessToken", newAccessToken);
//           localStorage.setItem("ACCESS_TOKEN", newAccessToken); // 새로운 토큰을 로컬 스토리지에 저장
//           originalRequest.headers.Authorization = `${newAccessToken}`; // 재발급된 토큰을 사용하여 요청
//           return axios(originalRequest); // 원래의 요청을 재시도
//         }
//       } catch (refreshError) {
//         console.error("Refresh token failed", refreshError);
//       }
//     }

//     return Promise.reject(error); // 에러가 발생했을 경우
//   }
// );

export default axios;