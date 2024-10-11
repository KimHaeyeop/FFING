package com.tbtr.ffing.domain.game.dto.internal;

import com.tbtr.ffing.domain.game.dto.request.DirectMatchReq;
import lombok.*;

@AllArgsConstructor
@Getter
@Builder
@Setter
@ToString
public class MatchInfo {
    private Long fromUserId;
    private Long toUserId;

    public static MatchInfo from(DirectMatchReq directMatchReq) {
        return new MatchInfo(directMatchReq.getFromUserId(), directMatchReq.getToUserId());
    }
}
