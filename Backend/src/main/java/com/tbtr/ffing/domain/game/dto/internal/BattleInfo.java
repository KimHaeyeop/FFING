package com.tbtr.ffing.domain.game.dto.internal;

import lombok.*;

@AllArgsConstructor
@Getter
@Builder
@ToString
public class BattleInfo {
    private String matchId;

    // TODO: fromUser의 펫 정보 (체력, 스탯, 공격옵션)
    private String fromUserPetInfo;

    // TODO: toUser의 펫 정보
    private String toUserPetInfo;
}
