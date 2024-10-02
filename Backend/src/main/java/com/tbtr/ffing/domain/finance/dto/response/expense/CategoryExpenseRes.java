package com.tbtr.ffing.domain.finance.dto.response.expense;

import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryExpenseRes {
    private ExpenseCategory category;
    private BigDecimal totalAmount;
    private LocalDate startDate;
    private LocalDate endDate;

    public CategoryExpenseRes(ExpenseCategory category, BigDecimal totalAmount) {
        this.category = category;
        this.totalAmount = totalAmount;
    }
}