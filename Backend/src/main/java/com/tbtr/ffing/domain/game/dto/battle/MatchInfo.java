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
    private String fromUserId;
    private String toUserId;

    public static MatchInfo from(DirectMatchReq directMatchReq) {
        return new MatchInfo(directMatchReq.getUserId(), directMatchReq.getOpponentUserId());
    }
}
