package com.tbtr.ffing.domain.finance.dto.response.expense;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class DailyExpenseRes {

    private String date;
    private List<ExpenseRes> expenses;
    private BigDecimal dailyTotal;
    private BigDecimal weeklyTotal;
}
