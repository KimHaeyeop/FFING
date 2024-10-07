package com.tbtr.ffing.domain.game.dto.request;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;

@RedisHash
@RequiredArgsConstructor
public class RandomMatchReq implements Serializable {
    private Long fromUserId;

}
