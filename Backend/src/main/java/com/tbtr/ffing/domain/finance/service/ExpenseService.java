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

    List<ExpenseRes> getMonthlyExpenses(ExpenseCategory category);

    WeeklyCategoryExpenseRes getWeeklyCategoryExpenses(boolean aThis);

    List<CategoryExpenseRes> getThisMonthCategoryExpenses();

    MonthlySummaryRes getMonthlySummary(String yearMonth);

    DailyExpenseRes getDailyExpense(String date);

    MonthlyExpenseAnalysisRes getAnalysisSummary(Long userId, Long ssafyUserId);
}
