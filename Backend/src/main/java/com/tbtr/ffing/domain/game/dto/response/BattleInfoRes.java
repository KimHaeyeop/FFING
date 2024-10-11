package com.tbtr.ffing.domain.game.dto.response;

import lombok.*;

@AllArgsConstructor
@Getter
@Builder
@ToString
public class BattleInfoRes {
    private String matchId;

    // 사용자1의 펫 정보
    private BattlePetInfoDetailsRes user1PetInfo;

    // 사용자2의 펫 정보
    private BattlePetInfoDetailsRes user2PetInfo;
}
