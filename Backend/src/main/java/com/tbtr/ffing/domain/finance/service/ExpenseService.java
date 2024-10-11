package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.response.expense.*;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.user.entity.User;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {

    void addCardTransactionToExpense(CardTransaction cardTransaction, User user);

    void addAccountTransferToExpense(AccountTransaction newAccountTransaction, User user);

    List<ExpenseRes> getMonthlyExpenses(ExpenseCategory category, Long userId);

    WeeklyCategoryExpenseRes getWeeklyCategoryExpenses(boolean aThis, Long userId);

    List<CategoryExpenseRes> getThisMonthCategoryExpenses(Long userId);

    MonthlySummaryRes getMonthlySummary(String yearMonth, Long userId, Long ssafyUserId);

    DailyExpenseRes getDailyExpense(String date, Long userId);

    MonthlyExpenseAnalysisRes getAnalysisSummary(Long userId, Long ssafyUserId);
}
