package com.tbtr.ffing.domain.game.service;

import com.tbtr.ffing.domain.game.dto.response.BattleInfoRes;
import com.tbtr.ffing.domain.game.dto.internal.MatchInfo;
import com.tbtr.ffing.domain.game.dto.request.BattleRoundInfoReq;
import com.tbtr.ffing.domain.game.dto.response.BattleRoundInfoRes;
import org.springframework.transaction.annotation.Transactional;

public interface BattleService {
    @Transactional
    BattleInfoRes setBattleMatchInfo(String matchId, MatchInfo matchInfo);

    @Transactional
    BattleRoundInfoRes handleBattleSignal(BattleRoundInfoReq battleRoundInfo);
}
