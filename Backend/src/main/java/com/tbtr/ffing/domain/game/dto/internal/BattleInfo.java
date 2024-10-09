package com.tbtr.ffing.domain.game.dto.internal;

import com.tbtr.ffing.domain.game.entity.PetInfo;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class BattleInfo {

    private String matchId;

    private BattlePetInfo battlePet1;
    private BattlePetInfo battlePet2;

    private LocalDateTime createdAt;

    public static BattleInfo from (String matchId, BattlePetInfo petInfo1, BattlePetInfo petInfo2, LocalDateTime createdAt) {
        return new BattleInfo(
            matchId, petInfo1, petInfo2, createdAt
        );
    }
}
