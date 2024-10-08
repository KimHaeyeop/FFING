package com.tbtr.ffing.domain.game.service;

import com.tbtr.ffing.domain.game.dto.request.RandomMatchCancelReq;
import com.tbtr.ffing.domain.game.dto.request.RandomMatchReq;
import org.springframework.transaction.annotation.Transactional;

public interface MatchingService {
    @Transactional
    String preferMatching(RandomMatchReq randomMatchReq);

    @Transactional
    void cancelRandomMatch(RandomMatchCancelReq randomMatchCancelReq);
}
