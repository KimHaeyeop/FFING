package com.tbtr.ffing.domain.finance.controller;

import com.tbtr.ffing.domain.finance.dto.response.expense.*;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.global.common.dto.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/expense")
@RestController
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping("/monthly")
    public ResponseEntity<Response<List<ExpenseRes>>> getMonthlyExpenses(@RequestParam(name="category", required = false) String categoryStr) {
        ExpenseCategory category = null;
        if (categoryStr != null && !categoryStr.isEmpty()) {
            try {
                category = ExpenseCategory.valueOf(categoryStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.ok(Response.<List<ExpenseRes>>builder()
                        .code(400L)
                        .message("잘못된 카테고리입니다.")
                        .build());
            }
        }

        List<ExpenseRes> expenses = expenseService.getMonthlyExpenses(category);
        return ResponseEntity.ok(Response.<List<ExpenseRes>>builder()
                .code(200L)
                .message("성공")
                .result(expenses)
                .build());
    }

    @GetMapping("/weekly/category/{week}")
    public ResponseEntity<Response<WeeklyCategoryExpenseRes>> getWeeklyCategoryExpenses(@PathVariable String week) {
        if (!week.equals("this") && !week.equals("last")) {
            return ResponseEntity.ok(Response.<WeeklyCategoryExpenseRes>builder()
                    .code(400L)
                    .message("잘못된 주 지정입니다. 'this' 또는 'last'만 가능합니다.")
                    .build());
        }

        boolean isThisWeek = week.equals("this");
        WeeklyCategoryExpenseRes weeklyExpenses = expenseService.getWeeklyCategoryExpenses(isThisWeek);

        return ResponseEntity.ok(Response.<WeeklyCategoryExpenseRes>builder()
                .code(200L)
                .message("성공")
                .result(weeklyExpenses)
                .build());
    }

    @GetMapping("/monthly/category")
    public ResponseEntity<Response<List<CategoryExpenseRes>>> getThisMonthCategoryExpenses() {
        List<CategoryExpenseRes> expenses = expenseService.getThisMonthCategoryExpenses();
        return ResponseEntity.ok(Response.<List<CategoryExpenseRes>>builder()
                .code(200L)
                .message("성공")
                .result(expenses)
                .build());
    }

    @GetMapping("/monthly/{yearMonth}")
    public ResponseEntity<Response<MonthlySummaryRes>> getMonthlyExpenseSummary(@PathVariable String yearMonth) {
        MonthlySummaryRes summary = expenseService.getMonthlySummary(yearMonth);
        return ResponseEntity.ok(Response.<MonthlySummaryRes>builder()
                .code(200L)
                .message("성공")
                .result(summary)
                .build());
    }

    @GetMapping
    public ResponseEntity<Response<DailyExpenseRes>> getDailyExpense(
            @RequestParam("date") @DateTimeFormat(pattern = "yyyyMMdd") String date) {
        DailyExpenseRes dailyExpense = expenseService.getDailyExpense(date);
        return ResponseEntity.ok(Response.<DailyExpenseRes>builder()
                .code(200L)
                .message("성공")
                .result(dailyExpense)
                .build());
    }

    /**
     * 월별(6개월 간) 지출액 확인 및 월간 지출 분석 API
     */
    @GetMapping("/monthly-summary")
    public ResponseEntity<?> getAnalysisSummary(Long userId, Long ssafyUserId) {
        MonthlyExpenseAnalysisRes analysisRes = expenseService.getAnalysisSummary(userId, ssafyUserId);
        return ResponseEntity.ok(Response.builder()
                .code(200L)
                .message("성공")
                .result(analysisRes).build());
    }
}