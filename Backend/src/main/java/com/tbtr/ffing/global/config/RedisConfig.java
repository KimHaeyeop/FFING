package com.tbtr.ffing.global.config;

import com.tbtr.ffing.domain.game.dto.internal.BattleInfo;
import com.tbtr.ffing.domain.game.dto.request.BattleRoundInfoReq;
import com.tbtr.ffing.domain.game.dto.response.BattleInfoRes;
import com.tbtr.ffing.domain.game.dto.internal.MatchInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.GenericToStringSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.port}")
    private int port;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(host, port);
        // Lettuce를 사용해서 Redis 연결 관리
    }

    @Bean
    public RedisTemplate<String, String> randomMatchRedisTemplate() {
        RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());

        return redisTemplate;
    }

    @Bean
    public RedisTemplate<String, MatchInfo> matchRedisTemplate(RedisConnectionFactory connectionFactory) {
        // key-value를 사용할 데이터 셋 타입으로 지정
        RedisTemplate<String, MatchInfo> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        return redisTemplate;

    }

    @Bean
    public RedisTemplate<String, Integer> countRedisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Integer> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new GenericToStringSerializer<>(Integer.class));
        return redisTemplate;

    }

    @Bean
    public RedisTemplate<String, BattleRoundInfoReq> userSignalRedisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, BattleRoundInfoReq> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        return redisTemplate;

    }

    @Bean
    public RedisTemplate<String, BattleInfo> battleRedisTemplate(RedisConnectionFactory connectionFactory) {
        // key-value를 사용할 데이터 셋 타입으로 지정
        RedisTemplate<String, BattleInfo> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        return redisTemplate;

    }

}
