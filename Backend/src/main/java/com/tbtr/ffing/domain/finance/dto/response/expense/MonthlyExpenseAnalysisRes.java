package com.tbtr.ffing.domain.finance.dto.response.expense;

import java.math.BigDecimal;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MonthlyExpenseAnalysisRes {

    private List<BigDecimal> sixMonthTotalExpense;  // 이번달 포함 6개월간의 소비액
    private BigDecimal monthOverMonthChange;  // 저번달 대비 이번달 소비액 증감률 또는 차이값
    private BigDecimal yearlyTotalExpense;    // 올해 총소비액
    private BigDecimal totalTargetExpense;    // 토탈 목표 소비액
    private BigDecimal monthAverageExpense; // 6개월간 평균 소비액
    private BigDecimal monthlyTargetExpense;  // 이번달 목표 소비액
    private BigDecimal futureMonthlyExpenses; // 앞으로의 매달 소비액
}
