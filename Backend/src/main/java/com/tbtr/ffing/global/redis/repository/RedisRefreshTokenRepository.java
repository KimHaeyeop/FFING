package com.tbtr.ffing.global.redis.repository;

import com.tbtr.ffing.global.redis.component.RedisRefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RedisRefreshTokenRepository extends CrudRepository<RedisRefreshToken, String> {

}
