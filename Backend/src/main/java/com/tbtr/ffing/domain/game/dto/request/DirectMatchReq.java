package com.tbtr.ffing.domain.game.dto.request;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class DirectMatchReq {
    private String userId;
    private String opponentUserId;
}
