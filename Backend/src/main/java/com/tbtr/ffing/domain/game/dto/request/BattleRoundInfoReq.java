package com.tbtr.ffing.domain.game.dto.request;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class BattleRoundInfoReq {
    private String matchId;

    private int currentRound;   // 현재 공격 횟수
    private int fromUserAttackNum;  // 고른 공격 숫자
    private int toUserAttackNum;    // 고른 공격 숫자

}
