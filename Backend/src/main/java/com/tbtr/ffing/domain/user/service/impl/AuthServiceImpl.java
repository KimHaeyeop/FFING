package com.tbtr.ffing.domain.user.service.impl;

import com.tbtr.ffing.domain.user.dto.UserInfoDTO;
import com.tbtr.ffing.domain.user.dto.UserSigninDTO;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.domain.user.service.AuthService;
import com.tbtr.ffing.global.auth.JWTUtil;
import com.tbtr.ffing.global.redis.service.RedisJwtTokenService;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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

    @Override
    public UserInfoDTO.Response signup(UserInfoDTO.Request requestDTO) {
        // ! 1. email 중복 체크
        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);

        }

        // ! 2. nickname 중복 체크
        if (userRepository.existsByNickname(requestDTO.getNickname())) {
            throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);
        }

        User userInfoDto = UserInfoDTO.Request.toEntity(requestDTO, bCryptPasswordEncoder);
        userRepository.save(userInfoDto);

        return UserInfoDTO.Response.of(userInfoDto);
    }

    @Override
    public Map<String, Object> signin(UserSigninDTO.Request requestDTO) {
        // 1. 유저 찾기
        User user = userRepository.findByEmail(requestDTO.getEmail());
        if (user == null) {
            throw new IllegalArgumentException("해당 이메일을 가진 유저가 없습니다.");
        }

        // 2. 유저 패스워드 일치 확인
        if (!bCryptPasswordEncoder.matches(requestDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. JWT 토큰 발급 및 Redis에 저장
        String accessToken = jwtUtil.createJwt("access", user.getUserId(), user.getRole().toString());
        String refreshToken = jwtUtil.createJwt("refresh", user.getUserId(), user.getRole().toString());
        redisJwtTokenService.saveRedisData(user.getUserId(), accessToken, refreshToken);

        // 4. 응답 데이터 구성
        UserSigninDTO.Response response = UserSigninDTO.Response.of(user);

        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);
        result.put("response", response);

        return result;
    }
}
