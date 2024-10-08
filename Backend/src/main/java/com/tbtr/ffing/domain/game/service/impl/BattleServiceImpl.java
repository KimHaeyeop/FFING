package com.tbtr.ffing.domain.game.service.impl;

import com.tbtr.ffing.domain.game.dto.internal.BattleInfo;
import com.tbtr.ffing.domain.game.dto.internal.BattlePetInfo;
import com.tbtr.ffing.domain.game.dto.request.BattleRoundInfoReq;
import com.tbtr.ffing.domain.game.dto.response.BattleInfoRes;
import com.tbtr.ffing.domain.game.dto.internal.MatchInfo;
import com.tbtr.ffing.domain.game.dto.response.BattlePetInfoDetailsRes;
import com.tbtr.ffing.domain.game.dto.response.BattleRoundInfoRes;
import com.tbtr.ffing.domain.game.entity.PetInfo;
import com.tbtr.ffing.domain.game.service.BattleService;
import com.tbtr.ffing.domain.game.service.PetService;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class BattleServiceImpl implements BattleService {

    private final PetService petService;
    private final UserRepository userRepository;
    private final RedisTemplate<String, BattleInfo> battleRedisTemplate;
    private final RedisTemplate<String, Integer> countRedisTemplate;

    private static final String BATTLE_KEY = "battle_key-";
    private static final String USER1_KEY = "user1Signal";
    private static final String USER2_KEY = "user2Signal";
    private static final int REQUIRED_SIGNALS = 2;

    @Override
    public BattleInfoRes setBattleMatchInfo(String matchId, MatchInfo matchInfo) {
        String redisKey = BATTLE_KEY + matchId;
//        System.out.println(redisKey);

        // 1. 각 사용자들의 펫 정보
        PetInfo pet1 = petService.getLatestPetInfo(matchInfo.getFromUserId());
        PetInfo pet2 = petService.getLatestPetInfo(matchInfo.getToUserId());
//        System.out.println(pet1.toString());

        // 2. 각 사용자들의 사용자 이름
        String username1 = userRepository.findByUserId(matchInfo.getFromUserId()).getUsername();
        String username2 = userRepository.findByUserId(matchInfo.getToUserId()).getUsername();
//        System.out.println(username2);

        // 3. 각 사용자 펫들의 최근 전적 기록 (최근 5개 승패)
        ArrayList<Integer> pet1WLHistory = petService.getRecentBattleScore(pet1.getPetInfoId());
        ArrayList<Integer> pet2WLHistory = petService.getRecentBattleScore(pet2.getPetInfoId());
//        System.out.println(pet2WLHistory.toString());

        // 정보를 조합하여 사용자들에게 줄 정보 만들기
        BattlePetInfoDetailsRes battlePet1InfoDetails = BattlePetInfoDetailsRes.from(pet1, username1, pet1WLHistory);
        BattlePetInfoDetailsRes battlePet2InfoDetails = BattlePetInfoDetailsRes.from(pet2, username2, pet2WLHistory);
//        System.out.println(battlePet2InfoDetails);

        // redis 에 배틀 세팅하기
        BattlePetInfo battlePetInfo1 = BattlePetInfo.from(pet1);
        BattlePetInfo battlePetInfo2 = BattlePetInfo.from(pet2);
        BattleInfo battleInfo = BattleInfo.from(matchId, battlePetInfo1, battlePetInfo2);
        battleRedisTemplate.opsForValue().set(redisKey, battleInfo);
        countRedisTemplate.opsForValue().set(redisKey, 0);

        // 사용자들에게 줄 정보 반환
        BattleInfoRes battleInfoRes = BattleInfoRes.builder()
                .matchId(matchId)
                .fromUserPetInfo(battlePet1InfoDetails)
                .toUserPetInfo(battlePet2InfoDetails)
                .build();

        return battleInfoRes;
    }

    @Override
    public BattleRoundInfoRes handleBattleSignal(BattleRoundInfoReq battleRoundInfo) {
//        String redisKey = BATTLE_KEY + battleRoundInfo.getMatchId();
//
//        Long currentCount = countRedisTemplate.opsForValue().increment(redisKey, 1);
//        System.out.println("Signal received from user: " + battleRoundInfo.getUserId() + ". Current count: " + currentCount);
//
//        if (currentCount != null) {
//            if (currentCount == 1) {
//                redisTemplate.opsForValue().set(USER1_KEY, "User: " + userId + ", Data: " + signalData);
//            } else if (currentCount == 2) {
//                redisTemplate.opsForValue().set(USER2_KEY, "User: " + userId + ", Data: " + signalData);
//            }
//
//            // Check if both signals have arrived
//            if (currentCount == REQUIRED_SIGNALS) {
//                // Retrieve the stored signal information
//                String user1Signal = (String) redisTemplate.opsForValue().get(USER1_KEY);
//                String user2Signal = (String) redisTemplate.opsForValue().get(USER2_KEY);
//
//                // Perform the next action with both signals
//                performNextAction(user1Signal, user2Signal);
//
//                // Reset the counter and clear the stored data for the next signals
//                redisTemplate.opsForValue().set(SIGNAL_COUNTER_KEY, 0);
//                redisTemplate.delete(USER1_KEY);
//                redisTemplate.delete(USER2_KEY);
//            }
//        }
        return null;
    }

    public BattleRoundInfoRes performBattle(BattleRoundInfoReq battleRoundInfo) {
//        String redisKey = BATTLE_KEY + battleRoundInfo.getMatchId();
//
//        BattleInfo battleInfo = battleRedisTemplate.opsForValue().get(redisKey);
//
//        if (battleInfo != null) {
//            BattlePetInfo battlePetInfo1 = battleInfo.getBattlePet1();
//            BattlePetInfo battlePetInfo2 = battleInfo.getBattlePet2();
////            PetStatus fromUserPet = battleInfo.getFromUserPetInfo();
////            PetStatus toUserPet = battleInfo.getToUserPetInfo();
//
//            // [싸움 로직]
//            int pet1AtkNum = battleRoundInfo.getFromUserAttackNum();
//            int pet2AtkNum = battleRoundInfo.getToUserAttackNum();
//
//            // 데미지 계산
//            double pet1Hp = battlePetInfo1.getHp();
//            double pet2Hp = battlePetInfo2.getHp();
//
//            int getPet1Stat = battlePetInfo1.getStats().get(pet2AtkNum);
//            int getPet2AtkStat = battlePetInfo2.getStats().get(pet2AtkNum);
//            int getPet2Stat = battlePetInfo2.getStats().get(pet1AtkNum);
//            int getPet1AtkStat = battlePetInfo1.getStats().get(pet1AtkNum);
//
//            pet1Hp -= doDamage(getPet1Stat, getPet1AtkStat);
//            pet2Hp -= doDamage(getPet2Stat, getPet2AtkStat);
//            if (pet1Hp <= 0) {
//                pet1Hp = 0;
//            }
//            if (pet2Hp <= 0) {
//                pet2Hp = 0;
//            }
//
//            // hp 업데이트
//            battlePetInfo1.setHp(pet1Hp);
//            battlePetInfo2.setHp(pet2Hp);
//
//            battleInfo.setBattlePet1(battlePetInfo1);
//            battleInfo.setBattlePet2(battlePetInfo2);
//
//            // 만약 체력이 0 이면 redis에서 삭제
//            if (pet1Hp <= 0 || pet2Hp <= 0) {
//                battleRedisTemplate.delete(redisKey);
//            } else {
//                battleRedisTemplate.opsForValue().set(redisKey, battleInfo);
//            }
//
//            // 턴 결과 반환
//            battleInfo.get
//            Long firstToMoverUserId =
//
//            BattleRoundInfoRes battleRoundResult = BattleRoundInfoRes.builder()
//                    .matchId(battleRoundInfo.getMatchId())
//                    .firstToMoveUserId(firstToMoverUserId)
//                    .fromUserAttackNum(pet1AtkNum)
//                    .toUserAttackNum(pet2AtkNum)
//                    .fromUserPet(battlePetInfo1)
//                    .toUserPet(battlePetInfo2)
//                    .build();
//
//            return null;
//        } else {
//            throw new CustomException(ErrorCode.BATTLE_NOT_EXISTS);
//        }
        return null;
    }

    /*
    [데미지 계산 로직]
    내 스탯보다 낮거나 같은 스탯 => 데미지 절반
    내 스탯보다 높은 스탯 => 데미지 그대로
     */
    public double doDamage (int myStat, int atkStat) {
        double damage = 0;
        if (myStat > atkStat) {
            damage = (double)atkStat / 2;
        } else {
            damage = atkStat ;
        }

        return damage;
    }
}
