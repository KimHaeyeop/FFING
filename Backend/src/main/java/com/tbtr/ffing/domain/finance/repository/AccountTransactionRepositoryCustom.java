package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.dto.response.expense.DailySummaryRes;

import java.math.BigDecimal;
import java.util.List;

public interface AccountTransactionRepositoryCustom {

    BigDecimal getTotalIncomeForMonth(String yearMonth);

    List<DailySummaryRes> getDailyIncomesForMonth(String yearMonth);
}
