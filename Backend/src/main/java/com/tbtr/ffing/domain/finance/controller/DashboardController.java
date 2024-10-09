package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.response.dashboard.MainDashboardRes;
import com.tbtr.ffing.domain.finance.service.DashboardService;
import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import com.tbtr.ffing.global.common.dto.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public ResponseEntity<?> mainPage(@AuthenticationPrincipal CustomUserDetails userDetails) {
        MainDashboardRes response = dashboardService.mainPage(userDetails.getUserId());
        return ResponseEntity.ok(Response.builder()
                .code(200L)
                .message("성공")
                .result(response).build());
    }
}