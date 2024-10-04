package com.tbtr.ffing.domain.game.dto.battle;

import lombok.*;

@AllArgsConstructor
@Getter
@Builder
@ToString
public class BattleMatchInfo {
    private String matchId;

    // TODO: fromUser의 펫 정보 (체력, 스탯, 공격옵션)
    private String fromUserInfo;

    // TODO: toUser의 펫 정보
    private String toUserInfo;
}
