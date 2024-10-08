package com.tbtr.ffing.domain.game.dto.request;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class BattleRoundInfoReq {
    private String matchId;

    private Long userId;
    private int userAttackNum;      // 고른 공격 숫자

}
