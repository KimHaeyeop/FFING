package com.tbtr.ffing.domain.finance.dto.response.expense;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class DailySummaryRes {

    private String date;
    private BigDecimal totalExpense;
    private BigDecimal totalIncome;

}
