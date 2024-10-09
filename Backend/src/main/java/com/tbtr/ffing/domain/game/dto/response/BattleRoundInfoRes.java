package com.tbtr.ffing.domain.game.dto.response;

import com.tbtr.ffing.domain.game.dto.internal.BattlePetInfo;
import com.tbtr.ffing.domain.game.dto.internal.PetStatus;
import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class BattleRoundInfoRes {
    private String matchId;

    private Long firstToMoveUserId;     // 먼저 공격하는 사람
    private int fromUserAttackNum;
    private int toUserAttackNum;
    private BattlePetInfo fromUserPet;      // 모든 공격처리를 마친 후의 펫 상태
    private BattlePetInfo toUserPet;        // 모든 공격처리를 마친 후의 펫 상태

}
