package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.user.entity.User;

import java.sql.Date;
import java.util.List;

public interface ExpenseService {

    void addCardTransactionToExpense(CardTransaction cardTransaction, User user);

    void addAccountTransferToExpense(AccountTransaction newAccountTransaction, User user);

    List<ExpenseRes> getMonthlyExpenses(String category);

}
