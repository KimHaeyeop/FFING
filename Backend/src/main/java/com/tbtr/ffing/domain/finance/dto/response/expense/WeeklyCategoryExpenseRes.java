package com.tbtr.ffing.domain.finance.dto.response.expense;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyCategoryExpenseRes {

    private BigDecimal weeklyTotalAmount;
    private List<CategoryExpenseRes> categoryExpenses;

}