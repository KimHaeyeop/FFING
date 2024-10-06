package com.tbtr.ffing.global.redis.component;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@AllArgsConstructor
@Getter
@RedisHash(value = "jwtRefreshToken")
public class RedisRefreshToken {
    @Id
    private String id;

    private String refreshToken;

    @TimeToLive
    private Long timeToLive;
}
