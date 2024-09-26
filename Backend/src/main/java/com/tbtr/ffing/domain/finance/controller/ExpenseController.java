package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.CategoryExpenseRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.MonthlySummaryRes;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/expense")
@RestController
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping("/monthly")
    public ResponseEntity<List<ExpenseRes>> getMonthlyExpenses(@RequestParam(name="category", required = false) String categoryStr) {
        ExpenseCategory category = null;
        if (categoryStr != null && !categoryStr.isEmpty()) {
            try {
                category = ExpenseCategory.valueOf(categoryStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                // 잘못된 카테고리 문자열이 입력된 경우 처리
                return ResponseEntity.badRequest().body(null);
            }
        }

        List<ExpenseRes> expenses = expenseService.getMonthlyExpenses(category);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/weekly/category/{week}")
    public ResponseEntity<List<CategoryExpenseRes>> getWeeklyCategoryExpenses(@PathVariable String week) {
        if (!week.equals("this") && !week.equals("last")) {
            return ResponseEntity.badRequest().build();
        }

        List<CategoryExpenseRes> expenses = expenseService.getWeeklyCategoryExpenses(week.equals("this"));
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/monthly/category")
    public ResponseEntity<List<CategoryExpenseRes>> getThisMonthCategoryExpenses() {

        List<CategoryExpenseRes> expenses = expenseService.getThisMonthCategoryExpenses();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/monthly/{yearMonth}")
    public ResponseEntity<MonthlySummaryRes> getMonthlyExpenseSummary(@PathVariable String yearMonth) {
        MonthlySummaryRes response = expenseService.getMonthlySummary(yearMonth);
        return ResponseEntity.ok(response);
    }
    

}
