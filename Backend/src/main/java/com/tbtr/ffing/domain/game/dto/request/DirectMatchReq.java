package com.tbtr.ffing.domain.game.dto.request;

import lombok.Getter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@ToString
public class DirectMatchReq {
    private Long fromUserId;
    private Long toUserId;
}
