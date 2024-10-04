package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.request.goal.GoalReq;
import com.tbtr.ffing.domain.finance.dto.request.goal.SpendingReq;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalDetailRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.SpendingRes;
import com.tbtr.ffing.domain.finance.entity.Goal;
import com.tbtr.ffing.domain.finance.repository.GoalRepository;
import com.tbtr.ffing.domain.finance.service.GoalService;
import com.tbtr.ffing.global.common.dto.Response;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
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
    private final GoalRepository goalRepository;

    /**
     * 목표 달성, 소비액 확인
     */
    @GetMapping("/check")
    public ResponseEntity<?> checkGoal(@RequestParam("userId") Long userId) {
        Map<String, String> map = new HashMap<>();
        LocalDate today = LocalDate.now();
        Goal goal = goalRepository.findByUserIdAndGoalTypeAndYear(userId, "1", today.getYear() + "");
        Goal spending = goalRepository.findByUserIdAndGoalTypeAndYearMonth(userId, "2",
                today.getYear() + "" + today.getMonthValue());

        String g = "설정되지 않았습니다";
        String s = "설정되지 않았습니다";
        if (goal != null) {
            g = goal.getBalance().toString();
        }
        if (spending != null) {
            s = spending.getBalance().toString();
        }
        map.put("목표 자산액", g);
        map.put("목표 소비액", s);
        return ResponseEntity.ok(map);
    }

    /**
     * 목표 설정 입장시
     */
    @GetMapping
    public ResponseEntity<?> getGoal(@RequestParam("userId") Long userId,
                                     @RequestParam("ssafyUserId") Long ssafyUserId) {
        GoalDetailRes goalDetailRes = goalService.getGoal(userId, ssafyUserId);
        Response<Object> response = Response.builder()
                                            .code(200L)
                                            .message("성공")
                                            .result(goalDetailRes).build();
        return ResponseEntity.ok(response);
    }

    /**
     * 목표 달성액 및 소비액 설정
     * - 달성액은 변경 X
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
    public ResponseEntity<?> setSpending(@RequestBody SpendingReq spendingReq) {
        SpendingRes spendingRes = goalService.setSpending(spendingReq);

        Response<Object> response = Response.builder()
                                            .code(200L)
                                            .message("목표 소비액이 설정되었습니다.")
                                            .result(spendingRes).build();
        return ResponseEntity.ok(response);
    }
}
