package com.tbtr.ffing.domain.alarm.controller;

import com.tbtr.ffing.domain.alarm.dto.response.AlarmRes;
import com.tbtr.ffing.domain.alarm.service.AlarmService;
import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import com.tbtr.ffing.global.common.dto.Response;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/alarm")
@RequiredArgsConstructor
public class AlarmController {

    private final AlarmService alarmService;

    /**
     * 알림 리스트 조회 : 최신순
     */
    @GetMapping
    public ResponseEntity<?> getAlarmList(@RequestParam("userId") Long userId) {
        List<AlarmRes> alarmList = alarmService.getAlarmList(userId);
        return ResponseEntity.ok(Response.builder()
                                         .code(200L)
                                         .message("알람 리스트 조회를 성공하였습니다.")
                                         .result(alarmList).build());
    }

    /**
     * 알림 단일 조회
     */
    @GetMapping("/{alarmId}")
    public ResponseEntity<?> getAlarm(@RequestParam("userId") Long userId,
                                                   @PathVariable("alarmId") Long alarmId) {
        AlarmRes alarmRes = alarmService.getAlarm(userId, alarmId);
        return ResponseEntity.ok(Response.builder()
                                         .code(200L)
                                         .message("알람 조회를 성공하였습니다.")
                                         .result(alarmRes).build());
    }
}
