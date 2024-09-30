package com.tbtr.ffing.domain.finance.dto.response.expense;

import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class ExpenseRes {

    private Long expenseId;
    private String expenseName;
    private ExpenseCategory expenseCategory;
    private String expenseMemo;
    private String expenseDate;
    private String expenseTime;
    private BigDecimal expenseBalance;

    public static ExpenseRes from(Expense expense) {
        return ExpenseRes.builder()
                .expenseId(expense.getExpenseId())
                .expenseName(expense.getExpenseName())
                .expenseCategory(expense.getExpenseCategory())
                .expenseMemo(expense.getExpenseMemo())
                .expenseDate(expense.getExpenseDate())
                .expenseTime(expense.getExpenseTime())
                .expenseBalance(expense.getExpenseBalance())
                .build();
    }

}
