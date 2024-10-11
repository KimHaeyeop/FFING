package com.tbtr.ffing.domain.game.controller;

import com.tbtr.ffing.domain.game.dto.request.BattleRoundInfoReq;
import com.tbtr.ffing.domain.game.dto.response.BattleRoundInfoRes;
import com.tbtr.ffing.domain.game.service.BattleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class BattleController {

    private final BattleService battleService;

    // 매칭 이후, 배틀 과정에서의 통신
    @MessageMapping("/battle/{matchId}")
    public void handleBattleEvent(@DestinationVariable String matchId, BattleRoundInfoReq battleRoundInfo) {

        // 배틀 관련 Service 구현부
//        BattleRoundInfoRes battleRoundInfoRes = battleService.handleBattleSignal(battleRoundInfo);
        battleService.handleBattleSignal(battleRoundInfo);

//        messagingTemplate.convertAndSend("/sub/battle/playing/"+ battleRoundInfo.getMatchId(), battleRoundInfoRes);

    }

}
