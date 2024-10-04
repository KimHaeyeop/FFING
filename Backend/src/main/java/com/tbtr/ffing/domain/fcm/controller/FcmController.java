package com.tbtr.ffing.domain.fcm.controller;

import com.tbtr.ffing.domain.fcm.service.FcmService;
import com.tbtr.ffing.global.common.dto.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/fcm")
public class FcmController {
    private final FcmService fcmService;

    @PostMapping("/register/{userId}")
    public ResponseEntity<?> registerFcm(@PathVariable("userId") Long userId, @RequestBody String token) {
        log.debug("Received userId: {}", userId);
        log.debug("Received token: {}", token);
        log.info("===클라이언트로부터 FCM 수신 START===");
        fcmService.saveToken(userId, token);
        System.out.println(token);
        log.info("===클라이언트로부터 FCM 수신 END===");
        return ResponseEntity.ok(Response.<Void>builder()
                .code(200L)
                .message("FCM이 정상 수신되었습니다")
                .build());
    }
}