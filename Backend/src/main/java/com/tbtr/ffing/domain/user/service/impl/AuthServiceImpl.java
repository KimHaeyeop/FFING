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
import com.tbtr.ffing.global.redis.service.RedisJwtTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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
    private final RedisJwtTokenService redisJwtTokenService;

    /**
     * 입력받은 정보를 통한 회원가입
     */
    @Override
    public UserInfoRes signup(UserInfoReq userInfoReq) {
        // 1. email 중복 체크
        if (userRepository.existsByEmail(userInfoReq.getEmail())) {
            throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);
        }

        // 2. 입력 정보를 통해 회원 정보 저장
        User userInfoDto = UserInfoReq.to(userInfoReq, bCryptPasswordEncoder);
        userRepository.save(userInfoDto);

        return UserInfoRes.of(userInfoDto);
    }

    /**
     * email, password 를 통한 로그인
     */
    @Override
    public SigninRes signin(UserSigninReq userSigninReq) {
        // 1. 유저 찾기
        User user = userRepository.findByEmail(userSigninReq.getEmail());
        if (user == null) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        // 2. 유저 패스워드 일치 확인
        if (!bCryptPasswordEncoder.matches(userSigninReq.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. JWT 토큰 발급 및 Redis에 저장
        CustomUserDetails customUserDetails = CustomUserDetails.of(user);
        String accessToken = jwtUtil.createJwt("access", customUserDetails);
        String refreshToken = jwtUtil.createJwt("refresh", customUserDetails);
        redisJwtTokenService.saveRedisData(user.getUserId(), accessToken, refreshToken);

        // 4. JWT accessToken을 Authorization 헤더에 추가
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "Bearer " + accessToken);

        // 5. 쿠키 생성 및 설정 (refreshToken을 쿠키에 추가)
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                                                          .httpOnly(true)
                                                          .path("/")
                                                          .maxAge(7 * 24 * 60 * 60)  // 7일
                                                          .secure(true)
                                                          .build();
        httpHeaders.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        UserSigninRes userSigninRes = UserSigninRes.of(user);
        return SigninRes.of(httpHeaders, userSigninRes);
    }

    /**
     * 회원 가입 시 닉네임 중복검사
     */
    @Override
    public Boolean isNicknameDuplication(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

}
