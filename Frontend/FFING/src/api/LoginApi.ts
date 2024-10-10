import axios from './AxiosConfig';

// API 요청을 담당하는 함수
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('/auth/signin', {
      email,
      password,
    });
    // console.log("테스트", response);

    // 응답 처리
    if (response.status === 200) {
      // console.log('로그인 성공', response);
      // 토큰을 반환하여 페이지에서 처리할 수 있게 함
      const accessToken = response.headers.authorization;
      // console.log(accessToken);
      const user = response.data.result;
      return { accessToken, user };
    }
  } catch (error: any) {
    // 에러가 발생하면 상위 컴포넌트로 에러를 던짐
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      throw new Error('아이디 또는 비밀번호가 잘못되었습니다.');
    } else {
      throw new Error('로그인 중 오류가 발생하였습니다.');
    }
  }
};
