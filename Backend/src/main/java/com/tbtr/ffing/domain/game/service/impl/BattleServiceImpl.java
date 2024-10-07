package com.tbtr.ffing.domain.game.service.impl;

import com.tbtr.ffing.domain.game.dto.internal.PetStatus;
import com.tbtr.ffing.domain.game.dto.request.BattleRoundInfoReq;
import com.tbtr.ffing.domain.game.dto.internal.BattleInfo;
import com.tbtr.ffing.domain.game.dto.internal.MatchInfo;
import com.tbtr.ffing.domain.game.dto.response.BattleRoundInfoRes;
import com.tbtr.ffing.domain.game.service.BattleService;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BattleServiceImpl implements BattleService {

    private final RedisTemplate<String, BattleInfo> battleRedisTemplate;

    private static final String BATTLE_KEY = "battle_key-";

    @Override
    public BattleInfo setBattleMatchInfo(String matchId, MatchInfo matchInfo) {
        String redisKey = BATTLE_KEY + matchId;

        // TODO: 두 사용자의 펫에 대한 정보, 배틀 정보 불러오기

        BattleInfo battleInfo = BattleInfo.builder()
                .matchId(matchId)
                .fromUserPetInfo("펫1")
                .toUserPetInfo("펫2")
                .build();
        battleRedisTemplate.opsForValue().set(redisKey, battleInfo);

        return battleInfo;
    }

    @Override
    public BattleRoundInfoRes battle(BattleRoundInfoReq battleRoundInfo) {
        String redisKey = BATTLE_KEY + battleRoundInfo.getMatchId();
        BattleInfo battleInfo = battleRedisTemplate.opsForValue().get(redisKey);

        if (battleInfo != null) {
//            PetStatus fromUserPet = battleInfo.getFromUserPetInfo();
//            PetStatus toUserPet = battleInfo.getToUserPetInfo();

            // TODO: 싸움 로직

        } else {
            throw new CustomException(ErrorCode.BATTLE_NOT_EXISTS);
        }

        return null;
    }

    // TODO: 싸움 로직 함수
}
