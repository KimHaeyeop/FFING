package com.tbtr.ffing.global.redis.component;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

@AllArgsConstructor
@Getter
@RedisHash(value = "jwtToken")
public class RedisJwtToken {
    @Id
    private String id;

    @Indexed
    private String accessToken;

    private String refreshToken;

    @TimeToLive
    private Long timeToLive;
}
