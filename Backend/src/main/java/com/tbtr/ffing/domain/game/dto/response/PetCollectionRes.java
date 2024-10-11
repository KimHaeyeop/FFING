package com.tbtr.ffing.domain.game.dto.response;

import lombok.*;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class PetCollectionRes {

    private Long petCollectionId;
    private String petCode;
    private String petName;
    private String createdDate;

}
