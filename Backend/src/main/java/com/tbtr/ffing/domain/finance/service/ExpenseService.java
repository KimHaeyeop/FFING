package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.CategoryExpenseRes;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.user.entity.User;

import java.util.List;

public interface ExpenseService {

    void addCardTransactionToExpense(CardTransaction cardTransaction, User user);

    void addAccountTransferToExpense(AccountTransaction newAccountTransaction, User user);

    List<ExpenseRes> getMonthlyExpenses(ExpenseCategory category);

    List<CategoryExpenseRes> getWeeklyCategoryExpenses(boolean aThis);

    List<CategoryExpenseRes> getThisMonthCategoryExpenses();
}
