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

    private final RedisRefreshTokenRepository redisRefreshTokenRepository;
    @Value("${REFRESH_TOKEN_EXPIRATION_PERIOD}")
    private Long REFRESH_TOKEN_EXPIRATION_PERIOD;

    public void saveRedisData(Long userId, String refreshToken) {
        log.info("[Redis] : saveRedisData");
        RedisRefreshToken refreshTokenRedis = new RedisRefreshToken(String.valueOf(userId), refreshToken,
                REFRESH_TOKEN_EXPIRATION_PERIOD);
        redisRefreshTokenRepository.save(refreshTokenRedis);
    }

    public void deleteRedisDataById(Long userId) {
        log.info("[Redis] : deleteRedisData by userId");
        redisRefreshTokenRepository.findById(userId.toString())
                                   .ifPresent(redisRefreshTokenRepository::delete);
    }
}
