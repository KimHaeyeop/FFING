package com.tbtr.ffing.domain.game.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@ToString
public class DirectMatchRes {
    private String requestId;
    private String userId;
}
