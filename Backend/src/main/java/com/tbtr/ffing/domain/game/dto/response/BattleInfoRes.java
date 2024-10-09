package com.tbtr.ffing.domain.game.dto.response;

import lombok.*;

@AllArgsConstructor
@Getter
@Builder
@ToString
public class BattleInfoRes {
    private String matchId;

    // fromUser의 펫 정보
    private BattlePetInfoDetailsRes fromUserPetInfo;

    // toUser의 펫 정보
    private BattlePetInfoDetailsRes toUserPetInfo;
}
