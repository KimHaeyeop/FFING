package com.tbtr.ffing.global.redis.service;

import com.tbtr.ffing.global.redis.component.RedisRefreshToken;
import com.tbtr.ffing.global.redis.repository.RedisRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class RedisRefreshTokenService {

    private final RedisRefreshTokenRepository redisRefreshTokenRepository;;
    @Value("${REFRESH_TOKEN_EXPIRATION_PERIOD}")
    private Long REFRESH_TOKEN_EXPIRATION_PERIOD;

    public void saveRedisData(Long userId, String refreshToken, String accessToken) {
        if (redisRefreshTokenRepository.findById(String.valueOf(userId)).isEmpty()) {
            deleteRedisDataById(String.valueOf(userId)); // 정합성 유지
        }
        log.info("[Redis] : saveRedisData");
        RedisRefreshToken refreshTokenRedis = new RedisRefreshToken(String.valueOf(userId), refreshToken, accessToken,
                REFRESH_TOKEN_EXPIRATION_PERIOD * 60);
        redisRefreshTokenRepository.save(refreshTokenRedis);
    }

    public void deleteRedisDataById(String id) {
        log.info("[Redis] : deleteRedisData by id");
        redisRefreshTokenRepository.findById(id)
                                   .ifPresent(redisRefreshTokenRepository::delete);
    }
}
