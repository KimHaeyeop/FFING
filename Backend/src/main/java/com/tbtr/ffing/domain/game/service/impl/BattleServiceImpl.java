package com.tbtr.ffing.domain.game.service.impl;

import com.tbtr.ffing.domain.game.dto.battle.BattleInfo;
import com.tbtr.ffing.domain.game.dto.battle.BattleMatchInfo;
import com.tbtr.ffing.domain.game.dto.battle.MatchInfo;
import com.tbtr.ffing.domain.game.service.BattleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BattleServiceImpl implements BattleService {

    private final RedisTemplate<String, BattleInfo> battleRedisTemplate;

    private static final String BATTLE_KEY = "battle_key-";

    @Override
    public BattleMatchInfo setBattleMatchInfo(String matchId, MatchInfo matchInfo) {
        String redisKey = BATTLE_KEY + matchId;

        // TODO: 두 사용자의 펫에 대한 정보, 배틀 정보 불러오기


        BattleInfo battleInfo = BattleInfo.builder()
                .matchId(matchId)
                .fromUserPet("펫1")
                .toUserPet("펫2")
                .build();
        battleRedisTemplate.opsForValue().set(redisKey, battleInfo);

        return BattleMatchInfo.builder()
                .matchId(matchId)
                .fromUserInfo("펫1임")
                .toUserInfo("펫2임")
                .build();
    }

}
