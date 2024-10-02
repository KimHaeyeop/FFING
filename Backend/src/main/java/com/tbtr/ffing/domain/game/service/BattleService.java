package com.tbtr.ffing.domain.game.service;

import com.tbtr.ffing.domain.game.dto.battle.BattleMatchInfo;
import com.tbtr.ffing.domain.game.dto.battle.MatchInfo;
import org.springframework.transaction.annotation.Transactional;

public interface BattleService {
    @Transactional
    BattleMatchInfo setBattleMatchInfo(String matchId, MatchInfo matchInfo);
}
