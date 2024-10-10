package com.tbtr.ffing.domain.game.dto.internal;

import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class BattleRoundPetInfo {

    private Long petInfoId;
    private boolean isFirst;            // 먼저 공격하는지 여부
    private int attackNum;              // 해당 펫이 선택한 공격 옵션 (0~4)
    private double damageDealt;         // 해당 펫이 공격한 데미지 값
    private String damageStatus;        // 유효타 여부 (Good, Normal, Bad)
    private double hp;
    private int totalStat;
    private ArrayList<Integer> stats;       // financeStat, foodBakeryStat, lifeCultureStat, shoppingStat, transportationStat

    public static BattleRoundPetInfo from (BattlePetInfo battlePetInfo) {
        return BattleRoundPetInfo.builder()
                .petInfoId(battlePetInfo.getPetInfoId())
                .totalStat(battlePetInfo.getTotalStat())
                .stats(battlePetInfo.getStats())
                .build();
    }
}
