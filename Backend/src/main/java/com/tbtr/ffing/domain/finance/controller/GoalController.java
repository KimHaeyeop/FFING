package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.request.goal.GoalReq;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalDetailRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.SpendingRes;
import com.tbtr.ffing.domain.finance.service.GoalService;
import com.tbtr.ffing.global.common.dto.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/goal")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("goal test");
    }

    /**
     * 목표 설정 입장시
     */
    @GetMapping
    public ResponseEntity<?> getGoal(@RequestParam Long userId) {
        GoalDetailRes goalDetailRes = goalService.getGoal(userId);
        Response<Object> response = Response.builder()
                                            .code(200L)
                                            .message("성공")
                                            .result(goalDetailRes).build();
        return ResponseEntity.ok(response);
    }

    /**
     * 목표 달성액 설정
     */
    @PostMapping("/set-goal")
    public ResponseEntity<?> setGoal(@RequestBody GoalReq goalReq) {
        GoalRes goalRes = goalService.setGoal(goalReq);

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
    public ResponseEntity<?> setSpending(@RequestBody GoalReq goalReq) {
        SpendingRes spendingRes = goalService.setSpending(goalReq);

        Response<Object> response = Response.builder()
                                            .code(200L)
                                            .message("목표 소비액이 설정되었습니다.")
                                            .result(spendingRes).build();
        return ResponseEntity.ok(response);
    }
}
