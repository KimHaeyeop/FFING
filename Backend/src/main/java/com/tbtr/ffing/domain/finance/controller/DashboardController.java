package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.response.dashboard.MainDashboardRes;
import com.tbtr.ffing.domain.finance.service.DashboardService;
import com.tbtr.ffing.global.common.dto.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    /**
     * 홈 화면
     */
    @GetMapping("/main")
    public ResponseEntity<?> mainPage(@RequestParam("userId") Long userId) {
        MainDashboardRes response = dashboardService.mainPage(userId);
        return ResponseEntity.ok(Response.builder()
                .code(200L)
                .message("성공")
                .result(response).build());
    }
}
/**
 * 유저 이름
 * 목표 달성
 * 목표 달성까지 00원 남았습니다.
 * 목표 자산액, 총 자산액
 * 현재 펫 -> 코드
 * 이번달 총 소비
 * 카테고리 별 소비
 */