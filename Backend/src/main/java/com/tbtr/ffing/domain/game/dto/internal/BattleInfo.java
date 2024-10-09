package com.tbtr.ffing.domain.game.dto.internal;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
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

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime createdAt;

    public static BattleInfo from (String matchId, BattlePetInfo petInfo1, BattlePetInfo petInfo2, LocalDateTime createdAt) {
        return new BattleInfo(
            matchId, petInfo1, petInfo2, createdAt
        );
    }
}
