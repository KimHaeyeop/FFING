package com.tbtr.ffing.domain.finance.dto.response.expense;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MonthlySummaryRes {

    private String yearMonth;
    private BigDecimal totalExpense;
    private BigDecimal totalIncome;
    private List<DailySummaryRes> dailySummary;

}
