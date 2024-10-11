package com.tbtr.ffing.domain.user.controller;

import com.tbtr.ffing.domain.finance.repository.AccountTransactionRepository;
import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import com.tbtr.ffing.global.common.dto.Response;
import java.math.BigDecimal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/user")
@RestController
public class UserController {

    private final AccountTransactionRepository accountTransactionRepository;

    public UserController(AccountTransactionRepository accountTransactionRepository) {
        this.accountTransactionRepository = accountTransactionRepository;
    }

    @GetMapping("/test")
    public ResponseEntity<?> test(@AuthenticationPrincipal CustomUserDetails userDetails) {
        System.out.println("test controller 진입");
        System.out.println("username: " + userDetails.getUsername());
        return ResponseEntity.ok("test ok");
    }

    @GetMapping("/test2")
    public ResponseEntity<?> test2(Long userId, Long ssafyUserId) {
        BigDecimal b = accountTransactionRepository.getTotalFixedIncomeForYearMonthBySsafyUserId("202409", ssafyUserId);
        return ResponseEntity.ok(Response.builder()
                .code(200L)
                .message("고정 수입 성공")
                .result(b).build());
    }
}