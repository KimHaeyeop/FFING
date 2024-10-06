package com.tbtr.ffing.domain.user.service.impl;

import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import com.tbtr.ffing.domain.user.dto.request.UserInfoReq;
import com.tbtr.ffing.domain.user.dto.request.UserSigninReq;
import com.tbtr.ffing.domain.user.dto.response.SigninRes;
import com.tbtr.ffing.domain.user.dto.response.UserInfoRes;
import com.tbtr.ffing.domain.user.dto.response.UserSigninRes;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.domain.user.service.AuthService;
import com.tbtr.ffing.global.auth.util.JWTUtil;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.CustomException;
import com.tbtr.ffing.global.redis.component.RedisRefreshToken;
import com.tbtr.ffing.global.redis.repository.RedisRefreshTokenRepository;
import com.tbtr.ffing.global.redis.service.RedisRefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class AuthServiceImpl implements AuthService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;
    private final RedisRefreshTokenService redisRefreshTokenService;
    private final RedisRefreshTokenRepository redisRefreshTokenRepository;

    @Value("${REFRESH_TOKEN_EXPIRATION_PERIOD}")
    private String REFRESH_TOKEN_EXPIRATION_PERIOD;

    /**
     * 입력받은 정보를 통한 회원가입
     */
    @Override
    public UserInfoRes signup(UserInfoReq userInfoReq) {
        // 1. email, nickname 중복 체크
        validateEmailDuplication(userInfoReq.getEmail());
        validateNicknameDuplication(userInfoReq.getNickname());

        // 2. 입력 정보를 통해 회원 정보 저장
        User user = UserInfoReq.to(userInfoReq, bCryptPasswordEncoder);
        userRepository.save(user);

        return UserInfoRes.of(user);
    }

    /**
     * email, password 를 통한 로그인
     */
    @Override
    public SigninRes signin(UserSigninReq userSigninReq) {
        // 1. 유저 찾기 및 패스워드 확인
        User user = findUserByEmail(userSigninReq.getEmail());
        validatePassword(userSigninReq.getPassword(), user.getPassword());

        // 2. JWT 토큰 발급 및 Redis 저장
        CustomUserDetails customUserDetails = CustomUserDetails.of(user);
        String accessToken = jwtUtil.createJwt("access", customUserDetails);
        String refreshToken = jwtUtil.createJwt("refresh", customUserDetails);
        redisRefreshTokenService.saveRedisData(user.getUserId(), refreshToken);

        // 3. JWT accessToken 헤더 추가, refreshToken 쿠키 설정
        HttpHeaders httpHeaders = createHeadersWithTokens(accessToken, refreshToken);

        return SigninRes.of(httpHeaders, UserSigninRes.of(user));
    }

    /**
     * 회원 가입 시 이메일 중복 검사
     */
    @Override
    public Boolean isEmialDuplication(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * 회원 가입 시 닉네임 중복 검사
     */
    @Override
    public Boolean isNicknameDuplication(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    /**
     * access token 만료 시 refresh token 기반 재발급 요청 (RTR 방식)
     */
    @Override
    public void reissue(HttpServletRequest request, HttpServletResponse response) {

        // 1. refresh token 추출
        String refresh = Arrays.stream(request.getCookies())
                               .filter(cookie -> cookie.getName().equals("refresh"))
                               .map(Cookie::getValue)
                               .findFirst()
                               .orElseThrow(() -> new CustomException(ErrorCode.REFRESH_TOKEN_NOT_FOUND));
        System.out.println(refresh);
        // 2. 유효성 및 만료 체크
        if (jwtUtil.isExpired(refresh)) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        // 3. redis 에 있는 값과 비교
        Long userId = jwtUtil.getUserId(refresh);
        RedisRefreshToken storedRefreshToken = redisRefreshTokenRepository.findById(userId.toString())
                                                                          .orElseThrow(() -> new CustomException(ErrorCode.INVALID_REFRESH_TOKEN));
        log.info("redis refresh: "+storedRefreshToken.getRefreshToken());
        if (!storedRefreshToken.getRefreshToken().equals(refresh)) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        // 4. 새로운 access, refresh token 생성
        User user = findUserByUserId(userId);
        CustomUserDetails customUserDetails = CustomUserDetails.of(user);
        String newAccessToken = jwtUtil.createJwt("access", customUserDetails);
        String newRefreshToken = jwtUtil.createJwt("refresh", customUserDetails);

        // 5. 기존 redis 데이터 삭제 및 저장
        redisRefreshTokenService.deleteRedisDataById(userId);
        redisRefreshTokenService.saveRedisData(userId, newRefreshToken);

        // 6. 응답 헤더에 추가
        HttpHeaders httpHeaders = createHeadersWithTokens(newAccessToken, newRefreshToken);
        for (String headerName : httpHeaders.keySet()) {
            response.setHeader(headerName, httpHeaders.getFirst(headerName));
        }
    }

    // 유저 아이디로 찾기
    private User findUserByUserId(Long userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }
        return user;
    }

    // 이메일 중복 체크
    private void validateEmailDuplication(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
    }

    // 닉네임 중복 체크
    private void validateNicknameDuplication(String nickname) {
        if (userRepository.existsByNickname(nickname)) {
            throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);
        }
    }

    // 유저 이메일로 찾기
    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                             .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    // 패스워드 확인
    private void validatePassword(String signinPassword, String userPassword) {
        if (!bCryptPasswordEncoder.matches(signinPassword, userPassword)) {
            throw new CustomException(ErrorCode.INCORRECT_PASSWORD);
        }
    }

    // JWT accessToken 헤더 추가, refreshToken 쿠키 설정
    private HttpHeaders createHeadersWithTokens(String accessToken, String refreshToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh", refreshToken)
                                                          .httpOnly(true)
                                                          .path("/")
                                                          .maxAge(Long.parseLong(REFRESH_TOKEN_EXPIRATION_PERIOD))
                                                          .secure(true)
                                                          .build();
        headers.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        return headers;
    }
}
