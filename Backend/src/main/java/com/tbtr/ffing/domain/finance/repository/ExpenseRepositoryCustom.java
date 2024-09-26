package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepositoryCustom {

    List<ExpenseRes> findMonthlyExpenses(LocalDate startDate, LocalDate endDate, String category);
}
