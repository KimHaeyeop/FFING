package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.request.goal.GoalReq;
import com.tbtr.ffing.domain.finance.dto.request.goal.SpendingReq;
import com.tbtr.ffing.domain.finance.dto.response.goal.CheckRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalDetailRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.SpendingRes;
import com.tbtr.ffing.domain.finance.service.GoalService;
import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import com.tbtr.ffing.global.common.dto.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/goal")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    /**
     * 목표 달성, 소비액 확인
     */
    @GetMapping("/check")
    public ResponseEntity<?> checkGoal(@AuthenticationPrincipal CustomUserDetails userDetails) {
        CheckRes checkRes = goalService.checkGoal(userDetails.getUserId());
        Response<Object> response = Response.builder()
                                            .code(200L)
                                            .message("성공")
                                            .result(checkRes).build();
        return ResponseEntity.ok(response);
    }

    /**
     * 목표 설정 입장시
     */
    @GetMapping
    public ResponseEntity<?> getGoal(@AuthenticationPrincipal CustomUserDetails userDetails) {
        GoalDetailRes goalDetailRes = goalService.getGoal(userDetails.getUserId(), userDetails.getSsafyUserId());
        Response<Object> response = Response.builder()
                                            .code(200L)
                                            .message("성공")
                                            .result(goalDetailRes).build();
        return ResponseEntity.ok(response);
    }

    /**
     * 목표 달성액 및 소비액 설정 - 달성액은 변경 X
     */
    @PostMapping("/set-goal")
    public ResponseEntity<?> setGoal(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                     @RequestBody GoalReq goalReq) {
        GoalRes goalRes = goalService.setGoal(customUserDetails.getUserId(), goalReq);

        Response<Object> response = Response.builder()
                                            .code(200L)
                                            .message("목표 달성액이 설정되었습니다.")
                                            .result(goalRes).build();
        return ResponseEntity.ok(response);
    }

    /**
     * 목표 소비액 설정
     */
    @PostMapping("/set-spending")

    public ResponseEntity<?> setSpending(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                         @RequestBody SpendingReq spendingReq) {
        SpendingRes spendingRes = goalService.setSpending(customUserDetails.getUserId(), spendingReq);

        Response<Object> response = Response.builder()
                                            .code(200L)
                                            .message("목표 소비액이 설정되었습니다.")
                                            .result(spendingRes).build();
        return ResponseEntity.ok(response);
    }
}
