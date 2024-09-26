package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/expense")
@RestController
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping("/monthly")
    public ResponseEntity<List<ExpenseRes>> getMonthlyExpenses(@RequestParam(required = false) String category) {
        List<ExpenseRes> expenses = expenseService.getMonthlyExpenses(category);
        return ResponseEntity.ok(expenses);
    }

}
