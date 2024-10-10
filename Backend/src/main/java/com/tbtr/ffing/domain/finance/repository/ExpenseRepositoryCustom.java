package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.dto.response.expense.DailySummaryRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.CategoryExpenseRes;
import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepositoryCustom {

    List<ExpenseRes> findMonthlyExpenses(LocalDate startDate, LocalDate endDate, ExpenseCategory category, Long userId);

    List<CategoryExpenseRes> findCategoryExpenses(LocalDate startDate, LocalDate endDate);

    BigDecimal getTotalExpenseForMonth(String yearMonth);

    List<DailySummaryRes> getDailyExpensesForMonth(String yearMonth);

    List<DailySummaryRes> getDailySummaryForMonth(String yearMonth);

    List<ExpenseRes> findExpensesByDate(String date);

    List<ExpenseRes> findExpensesBetweenDates(String startDate, String endDate);

    BigDecimal calculateTotalExpenseByDate(String date);

    BigDecimal calculateTotalExpenseBetweenDates(String startDate, String endDate);
}
