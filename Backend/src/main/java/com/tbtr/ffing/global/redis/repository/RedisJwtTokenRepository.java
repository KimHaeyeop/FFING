package com.tbtr.ffing.global.redis.repository;

import com.tbtr.ffing.global.redis.component.RedisJwtToken;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface RedisJwtTokenRepository extends CrudRepository<RedisJwtToken, String> {
    Optional<RedisJwtToken> findByAccessToken(String accessToken);
    Optional<RedisJwtToken> findById(String userId);
}
