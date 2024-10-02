package com.tbtr.ffing.domain.game.dto.battle;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class BattleInfo {
    private String matchId;

    // TODO: user1 펫 상태 (체력, 공격력/수비력, ?)
    private String fromUserPet;
    // TODO: user2 펫 상태
    private String toUserPet;
}
