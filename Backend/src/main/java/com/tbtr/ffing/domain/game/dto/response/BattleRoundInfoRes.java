package com.tbtr.ffing.domain.game.dto.response;

import com.tbtr.ffing.domain.game.dto.internal.BattlePetInfo;
import com.tbtr.ffing.domain.game.dto.internal.BattleRoundPetInfo;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class BattleRoundInfoRes {
    private String matchId;

    private boolean isFinished;
    private BattleRoundPetInfo pet1Info;
    private BattleRoundPetInfo pet2Info;

}
