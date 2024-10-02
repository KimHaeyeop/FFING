package com.tbtr.ffing.global.redis.service;

import com.tbtr.ffing.global.redis.component.RedisJwtToken;
import com.tbtr.ffing.global.redis.repository.RedisJwtTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class RedisJwtTokenService {

    private final RedisJwtTokenRepository redisJwtTokenRepository;;
    @Value("${REFRESH_TOKEN_EXPIRATION_PERIOD}")
    private Long REFRESH_TOKEN_EXPIRATION_PERIOD;

    public void saveRedisData(Long userId, String accessToken, String refreshToken) {
        log.info("[Redis] : saveRedisData");
        RedisJwtToken refreshTokenRedis = new RedisJwtToken(String.valueOf(userId), accessToken, refreshToken,
                REFRESH_TOKEN_EXPIRATION_PERIOD * 60);
        redisJwtTokenRepository.save(refreshTokenRedis);
    }

    public void deleteRedisDataById(String id) {
        log.info("[Redis] : deleteRedisData by id");
        redisJwtTokenRepository.findById(id)
                               .ifPresent(redisJwtTokenRepository::delete);
    }
}
