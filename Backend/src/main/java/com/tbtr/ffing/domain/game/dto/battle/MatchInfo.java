package com.tbtr.ffing.domain.game.dto.battle;

import com.tbtr.ffing.domain.game.dto.request.DirectMatchReq;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@Getter
@Setter
@ToString
public class MatchInfo {
    private Long fromUserId;
    private Long toUserId;

    public static MatchInfo from(DirectMatchReq directMatchReq) {
        return new MatchInfo(directMatchReq.getFromUserId(), directMatchReq.getToUserId());
    }
}
