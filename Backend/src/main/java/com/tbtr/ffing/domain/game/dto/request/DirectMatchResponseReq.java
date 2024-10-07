package com.tbtr.ffing.domain.game.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class DirectMatchResponseReq {
    private String requestId;
    private String toUserId;
}
