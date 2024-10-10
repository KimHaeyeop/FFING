package com.tbtr.ffing.domain.game.service.impl;

import com.tbtr.ffing.domain.game.dto.internal.*;
import com.tbtr.ffing.domain.game.dto.request.BattleRoundInfoReq;
import com.tbtr.ffing.domain.game.dto.response.BattleInfoRes;
import com.tbtr.ffing.domain.game.dto.response.BattlePetInfoDetailsRes;
import com.tbtr.ffing.domain.game.dto.response.BattleRoundInfoRes;
import com.tbtr.ffing.domain.game.entity.BattleHistory;
import com.tbtr.ffing.domain.game.entity.PetInfo;
import com.tbtr.ffing.domain.game.repository.BattleHistoryRepository;
import com.tbtr.ffing.domain.game.service.BattleService;
import com.tbtr.ffing.domain.game.service.PetService;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class BattleServiceImpl implements BattleService {

    private final SimpMessageSendingOperations messagingTemplate;
    private final RedisTemplate<String, BattleInfo> battleRedisTemplate;
    private final RedisTemplate<String, Integer> countRedisTemplate;
    private final RedisTemplate<String, BattleRoundInfoReq> userSignalRedisTemplate;
    private final PetService petService;
    private final UserRepository userRepository;

    private static final String BATTLE_KEY = "battle_key-";
    private static final String COUNT_KEY = "count-";
    private static final String USER1_KEY = "user1Signal";
    private static final String USER2_KEY = "user2Signal";
    private static final int REQUIRED_SIGNALS = 2;
    private final BattleHistoryRepository battleHistoryRepository;

    @Override
    public BattleInfoRes setBattleMatchInfo(String matchId, MatchInfo matchInfo) {
        String battleRedisKey = BATTLE_KEY + matchId;
        String countRedisKey = COUNT_KEY + matchId;
//        System.out.println(redisKey);

        // 1. 각 사용자들의 펫 정보
        PetInfo pet1 = petService.getLatestPetInfo(matchInfo.getFromUserId());
        PetInfo pet2 = petService.getLatestPetInfo(matchInfo.getToUserId());
//        System.out.println(pet1.toString());

        // 2. 각 사용자들의 사용자 닉네임
        String nickname1 = userRepository.findByUserId(matchInfo.getFromUserId()).getNickname();
        String nickname2 = userRepository.findByUserId(matchInfo.getToUserId()).getNickname();
//        System.out.println(nickname2);

        // 3. 각 사용자 펫들의 최근 전적 기록 (최근 5개 승패)
        ArrayList<Integer> pet1WLHistory = petService.getRecentBattleScore(pet1.getPetInfoId());
        ArrayList<Integer> pet2WLHistory = petService.getRecentBattleScore(pet2.getPetInfoId());
//        System.out.println(pet2WLHistory.toString());

        // 정보를 조합하여 사용자들에게 줄 정보 만들기
        BattlePetInfoDetailsRes battlePet1InfoDetails = BattlePetInfoDetailsRes.from(pet1, nickname1, pet1WLHistory);
        BattlePetInfoDetailsRes battlePet2InfoDetails = BattlePetInfoDetailsRes.from(pet2, nickname2, pet2WLHistory);
//        System.out.println(battlePet2InfoDetails);

        // redis 에 배틀 세팅하기
        BattlePetInfo battlePetInfo1 = BattlePetInfo.from(pet1);
        BattlePetInfo battlePetInfo2 = BattlePetInfo.from(pet2);
        BattleInfo battleInfo = BattleInfo.from(matchId, battlePetInfo1, battlePetInfo2, LocalDateTime.now());
        battleRedisTemplate.opsForValue().set(battleRedisKey, battleInfo);
        countRedisTemplate.opsForValue().set(countRedisKey, 0);
        System.out.println(battleInfo.toString());

        // 사용자들에게 줄 정보 반환
        BattleInfoRes battleInfoRes = BattleInfoRes.builder()
                .matchId(matchId)
                .user1PetInfo(battlePet1InfoDetails)
                .user2PetInfo(battlePet2InfoDetails)
                .build();

        return battleInfoRes;
    }

    @Override
    public BattleRoundInfoRes handleBattleSignal(BattleRoundInfoReq battleRoundInfo) {
        String countRedisKey = COUNT_KEY + battleRoundInfo.getMatchId();

        Long currentCount = countRedisTemplate.opsForValue().increment(countRedisKey, 1);
        System.out.println("Signal received from user: " + battleRoundInfo.getPetInfoId() + ". Current count: " + currentCount);

        if (currentCount != null) {
            if (currentCount == 1) {
                userSignalRedisTemplate.opsForValue().set(USER1_KEY, battleRoundInfo);
            } else if (currentCount == 2) {
                userSignalRedisTemplate.opsForValue().set(USER2_KEY, battleRoundInfo);
            }

            // Check if both signals have arrived
            if (currentCount == REQUIRED_SIGNALS) {
                // Retrieve the stored signal information
                BattleRoundInfoReq user1Signal = userSignalRedisTemplate.opsForValue().get(USER1_KEY);
                BattleRoundInfoReq user2Signal = userSignalRedisTemplate.opsForValue().get(USER2_KEY);

                // Perform the next action with both signals
                performBattle(battleRoundInfo.getMatchId(), user1Signal, user2Signal);

                // Reset the counter and clear the stored data for the next signals
                countRedisTemplate.delete(countRedisKey);
                userSignalRedisTemplate.delete(USER1_KEY);
                userSignalRedisTemplate.delete(USER2_KEY);
            }
        }

        return null;
    }

    public void performBattle(String matchId, BattleRoundInfoReq battleRoundInfo1, BattleRoundInfoReq battleRoundInfo2) {
        String battleRedisKey = BATTLE_KEY + matchId;

        BattleInfo battleInfo = battleRedisTemplate.opsForValue().get(battleRedisKey);

        if (battleInfo != null) {
            System.out.println("Battle Start : " + battleInfo.toString());
            BattlePetInfo battlePetInfo1 = null;
            BattlePetInfo battlePetInfo2 = null;
            BattleRoundPetInfo battleRoundPet1Info;
            BattleRoundPetInfo battleRoundPet2Info;

            if (battleInfo.getBattlePet1().getPetInfoId() == battleRoundInfo1.getPetInfoId()) {
                battlePetInfo1 = battleInfo.getBattlePet1();
                battlePetInfo2 = battleInfo.getBattlePet2();
            } else {
                battlePetInfo1 = battleInfo.getBattlePet2();
                battlePetInfo2 = battleInfo.getBattlePet1();
            }
            battleRoundPet1Info = BattleRoundPetInfo.from(battlePetInfo1);
            battleRoundPet2Info = BattleRoundPetInfo.from(battlePetInfo2);

            int pet1AtkNum = battleRoundInfo1.getPetAttackNum();
            int pet2AtkNum = battleRoundInfo2.getPetAttackNum();
            battleRoundPet1Info.setAttackNum(pet1AtkNum);
            battleRoundPet2Info.setAttackNum(pet2AtkNum);

            // [싸움 로직]
            double pet1Hp = battlePetInfo1.getHp();
            double pet2Hp = battlePetInfo2.getHp();

            int getPet1Stat = battlePetInfo1.getStats().get(pet2AtkNum);
            int getPet2AtkStat = battlePetInfo2.getStats().get(pet2AtkNum);
            int getPet2Stat = battlePetInfo2.getStats().get(pet1AtkNum);
            int getPet1AtkStat = battlePetInfo1.getStats().get(pet1AtkNum);

            DamageInfo pet2DamageInfo = doDamage(getPet1Stat, getPet2AtkStat);
            DamageInfo pet1DamageInfo = doDamage(getPet2Stat, getPet1AtkStat);

            battleRoundPet1Info.setDamageDealt(pet1DamageInfo.getDamage());
            battleRoundPet1Info.setDamageStatus(pet1DamageInfo.getDamageStatus());
            battleRoundPet2Info.setDamageDealt(pet2DamageInfo.getDamage());
            battleRoundPet2Info.setDamageStatus(pet2DamageInfo.getDamageStatus());

            // 데미지 넣기
            pet1Hp -= pet2DamageInfo.getDamage();
            pet2Hp -= pet1DamageInfo.getDamage();
            if (pet1Hp <= 0) {
                pet1Hp = 0;
            }
            if (pet2Hp <= 0) {
                pet2Hp = 0;
            }

            // hp 업데이트
            battlePetInfo1.setHp(pet1Hp);
            battlePetInfo2.setHp(pet2Hp);

            battleInfo.setBattlePet1(battlePetInfo1);
            battleInfo.setBattlePet2(battlePetInfo2);
            battleRoundPet1Info.setHp(pet1Hp);
            battleRoundPet2Info.setHp(pet2Hp);

            // 먼저 공격할 pet 정하기
            Random random = new Random();
            Long firstToMovePetId = random.nextBoolean() ? battlePetInfo1.getPetInfoId() : battlePetInfo2.getPetInfoId();

            if (firstToMovePetId == battlePetInfo1.getPetInfoId()) {
                battleRoundPet1Info.setFirst(true);
                battleRoundPet2Info.setFirst(false);
            } else {
                battleRoundPet1Info.setFirst(false);
                battleRoundPet2Info.setFirst(true);
            }

            BattleRoundInfoRes battleRoundResult = BattleRoundInfoRes.builder()
                    .matchId(matchId)
                    .isFinished(false)
                    .pet1Info(battleRoundPet1Info)
                    .pet2Info(battleRoundPet2Info)
                    .build();

            // 만약 체력이 0 이면 (승자가 나왔으면)
            if (pet1Hp <= 0 || pet2Hp <= 0) {
                battleRoundResult.setFinished(true);

                // 배틀 히스토리 기록
                Long winnerPetId = findWinner(battlePetInfo1.getPetInfoId(), battlePetInfo2.getPetInfoId(), pet1Hp, pet2Hp, firstToMovePetId);
                System.out.println(winnerPetId + ", " +  battlePetInfo1.getPetInfoId() + ", " + battlePetInfo2.getPetInfoId());

                BattleHistory battleHistory = BattleHistory.builder()
                        .createdAt(battleInfo.getCreatedAt())
                        .pet1Id(battlePetInfo1.getPetInfoId())
                        .pet2Id(battlePetInfo2.getPetInfoId())
                        .winnerPetId(winnerPetId)
                        .build();
                battleHistoryRepository.save(battleHistory);

                // redis에서 기록 삭제
                battleRedisTemplate.delete(battleRedisKey);

            } else {
                battleRedisTemplate.opsForValue().set(battleRedisKey, battleInfo);
            }

            // 턴 결과 반환
            System.out.println(battleRoundResult.toString());

            // 두 사용자에게 결과 보내기
            messagingTemplate.convertAndSend("/sub/battle/playing/" + matchId, battleRoundResult);
        } else {
            throw new CustomException(ErrorCode.BATTLE_NOT_EXISTS);
        }

    }

    /*
    [데미지 계산 로직]
    내 스탯보다 낮은 스탯 => 데미지 절반 (효과 : 별로)
    내 스탯과 같은 스탯 => 데미지 그대로 (효과 : 보통)
    내 스탯보다 높은 스탯 => 데미지 1.2배 (효과 : 좋음
    반환 : 소수점 1자리까지만
     */
    public DamageInfo doDamage (int myStat, int atkStat) {
        double damage = 0;
        String damageStatus = "";
        if (myStat > atkStat) {
            damage = (double)atkStat / 2;
            damageStatus = "Bad";
        } else if (myStat == atkStat) {
            damage = atkStat;
            damageStatus = "Normal";
        } else {
            damage = atkStat * 1.2;
            damageStatus = "Good";
        }

        return DamageInfo.builder()
                .damage(Math.round(damage * 10.0) / 10.0)
                .damageStatus(damageStatus)
                .build();

    }

    public Long findWinner (Long pet1Id, Long pet2Id, double pet1Hp, double pet2Hp, Long moveFirstPetId) {
        Long winnerPetId = null;

        if (pet1Hp <= 0 && pet2Hp <= 0) {
            winnerPetId = moveFirstPetId;
        } else if (pet1Hp > 0 && pet2Hp == 0) {
            winnerPetId = pet1Id;
        } else if (pet1Hp == 0 && pet2Hp > 0) {
            winnerPetId = pet2Id;
        }

        return winnerPetId;
    }
}
