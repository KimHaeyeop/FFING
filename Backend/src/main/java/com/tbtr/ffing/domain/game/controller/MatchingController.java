package com.tbtr.ffing.domain.game.controller;

import com.tbtr.ffing.domain.game.dto.battle.*;
import com.tbtr.ffing.domain.game.dto.request.DirectMatchReq;
import com.tbtr.ffing.domain.game.dto.request.MatchCancelReq;
import com.tbtr.ffing.domain.game.dto.request.RandomMatchReq;
import com.tbtr.ffing.domain.game.dto.response.BattleMatchRejectRes;
import com.tbtr.ffing.domain.game.dto.response.DirectMatchRes;
import com.tbtr.ffing.domain.game.dto.request.DirectMatchResponseReq;
import com.tbtr.ffing.domain.game.service.BattleService;
import com.tbtr.ffing.domain.game.service.MatchingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MatchingController {

    private final SimpMessageSendingOperations messagingTemplate;
    private final RedisTemplate<String, MatchInfo> matchRedisTemplate;
    private final MatchingService matchingService;
    private final BattleService battleService;

    private static final String MATCH_REQUEST_KEY = "match_request-";
    private static final String BATTLE_KEY = "battle-";

    @MessageMapping("/")
    @SendTo("/sub/")
    public String test(){
        System.out.println("socket test");

        return "socket hi";
    }

    // TODO: 랜덤 매칭 추가
    @MessageMapping("/match/random/request")
    public void handleRandomMatchEvent(RandomMatchReq randomMatchEvent) {
//        log.info("received random match event: {}", randomMatchEvent.toString());
//
//        MatchInfo matchInfo = matchingService.setAndGetMatchInfo(randomMatchEvent);
//
//        messagingTemplate.convertAndSend("/sub/match/" + matchInfo.getBattleKey(), matchInfo);
//        log.info("send random match event to key: {}", matchInfo.getBattleKey().toString());
    }

    @MessageMapping("/match/direct/request")
    public void handleDirectMatchRequestEvent(DirectMatchReq directMatchRequest) {
        log.info("received direct match request event: {}", directMatchRequest.toString());

        // TODO: requestId 중복 처리
        String requestId = UUID.randomUUID().toString();
        String redisKey = MATCH_REQUEST_KEY + requestId;

        matchRedisTemplate.opsForValue().set(redisKey, MatchInfo.from(directMatchRequest));

        // TODO: 매칭 요청자에게 requestId를 보내줘야 함 -> for 요청 취소

        messagingTemplate.convertAndSend(
                "/sub/match/battle-request/" + directMatchRequest.getToUserId(), new DirectMatchRes(requestId, directMatchRequest.getFromUserId(), directMatchRequest.getToUserId())
        );

        log.info("sent direct match request event with key: {} to user: {}", requestId, directMatchRequest.getToUserId());
//        MatchInfo matchInfo = matchingService.setAndGetMatchInfo(directMatchEvent);
//
//        messagingTemplate.convertAndSend("/sub/match/" + matchInfo.getBattleKey(), matchInfo);
    }

    @MessageMapping("/match/direct/accept")
    public void handleDirectMatchAcceptEvent(DirectMatchResponseReq directMatchAccept) {
        log.info("received direct match accept event: {}", directMatchAccept.toString());

        String redisKey = MATCH_REQUEST_KEY + directMatchAccept.getRequestId();
        MatchInfo directMatchRes = matchRedisTemplate.opsForValue().get(redisKey);

        if (directMatchRes != null) {
            // 요청을 redis에서 삭제
            matchRedisTemplate.delete(redisKey);

            // 매치 생성 (matchId)
            // TODO: matchId 중복 처리
            String matchId = UUID.randomUUID().toString();

            // TODO: 양쪽 펫 정보 불러오기
            BattleMatchInfo battleMatchInfo = battleService.setBattleMatchInfo(matchId, directMatchRes);

            // 양 사용자에게 매치 성사 알림
            messagingTemplate.convertAndSend(
                    "/sub/battle/ready/" + directMatchRes.getFromUserId(), battleMatchInfo
            );
            messagingTemplate.convertAndSend(
                    "/sub/battle/ready/" + directMatchRes.getToUserId(), battleMatchInfo
            );
        }

        log.info("sent direct match accept event with key: {}", directMatchAccept.getRequestId());
    }

    @MessageMapping("/match/direct/reject")
    public void handleDirectMatchRejectEvent(DirectMatchResponseReq directMatchReject) {
        log.info("received direct match reject event: {}", directMatchReject.toString());

        String redisKey = MATCH_REQUEST_KEY + directMatchReject.getRequestId();
        MatchInfo directMatchRes = matchRedisTemplate.opsForValue().get(redisKey);

        if (directMatchRes != null) {
            // 요청을 redis에서 삭제
            matchRedisTemplate.delete(redisKey);

            // 요청한 사용자에게 거절 알림
            messagingTemplate.convertAndSend(
                    "/sub/battle/rejected/" + directMatchRes.getFromUserId(),
                    new BattleMatchRejectRes(directMatchReject.getRequestId(), directMatchRes.getToUserId())
            );
        }

        log.info("sent direct match reject event with key: {}", directMatchReject.getRequestId());
    }

    @MessageMapping("/match/cancel")
    public void handleBattleCancel(MatchCancelReq matchCancelReq) {
        String redisKey = MATCH_REQUEST_KEY + matchCancelReq.getRequestId();
        matchRedisTemplate.delete(redisKey);

//        messagingTemplate.convertAndSend(
//                "/sub/match/battle-request-cancelled/" + matchCancelReq.getFromUserId(),
//                new BattleCancelledNotification(matchCancelReq.getRequestId())
//        );
    }

    // 매칭 이후, 배틀 과정에서의 통신
//    @MessageMapping("/battle/{matchId}")
//    public void handleBattleEvent(@DestinationVariable String matchId, BattleInfoReq battleInfo) {
//        // 배틀 관련 Service 구현부
//
//        messagingTemplate.convertAndSend("/sub/battle/playing/"+ battleInfo.getBattleKey(), battleInfo);
//
//    }

    // 배틀 종료 후, 매칭 연결 끊기
//    @MessageMapping("/exit")
//    public void handleExitMatchEvent(MatchExitReq matchExitEvent) {
//        matchExitEvent.setMessage("매칭에서 퇴장하였습니다.");
//        // 퇴장 관련 Service 구현부
//
//
//        messagingTemplate.convertAndSend("/sub/match/exit/" + matchExitEvent.getBattleKey(), matchExitEvent);
//
//    }

}
