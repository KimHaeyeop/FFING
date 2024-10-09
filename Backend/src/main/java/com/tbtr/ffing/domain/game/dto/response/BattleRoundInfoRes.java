package com.tbtr.ffing.domain.game.dto.response;

import com.tbtr.ffing.domain.game.dto.internal.BattlePetInfo;
import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class BattleRoundInfoRes {
    private String matchId;

    private Long firstToMovePetId;      // 먼저 공격하는 사람
    private int pet1AttackNum;
    private String pet1DamageStatus;    // 유효타 여부 (Good, Normal, Bad)
    private int pet2AttackNum;
    private String pet2DamageStatus;
    private BattlePetInfo pet1Info;     // 모든 공격처리를 마친 후의 펫 상태
    private BattlePetInfo pet2Info;     // 모든 공격처리를 마친 후의 펫 상태
}
