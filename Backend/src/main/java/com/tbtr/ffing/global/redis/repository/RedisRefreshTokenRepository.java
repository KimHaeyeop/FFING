package com.tbtr.ffing.global.redis.repository;

import com.tbtr.ffing.global.redis.component.RedisRefreshToken;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface RedisRefreshTokenRepository extends CrudRepository<RedisRefreshToken, String> {
    Optional<RedisRefreshToken> findByUserId(String userId);
}
