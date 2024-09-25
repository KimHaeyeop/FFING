package com.tbtr.ffing.domain.finance.service;

import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.user.entity.User;

public interface ExpenseService {

    void addCardTransactionToExpense(CardTransaction cardTransaction, User user);

}
