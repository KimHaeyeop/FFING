package com.tbtr.ffing.domain.game.dto.request;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class BattleRoundInfoReq {
    private String matchId;

    private Long petInfoId;
    private int petAttackNum;      // 고른 공격 숫자

}
