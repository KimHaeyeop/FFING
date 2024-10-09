package com.tbtr.ffing.domain.game.dto.request;

import lombok.Getter;
import lombok.ToString;


@Getter
@ToString
public class RandomMatchReq {

    private Long fromUserId;
    private int petTotalStat;

}
