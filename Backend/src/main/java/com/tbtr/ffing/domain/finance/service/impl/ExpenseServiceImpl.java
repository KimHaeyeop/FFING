package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.repository.ExpenseRepository;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    /**
     * 카드 지출 -> 전체 지출에 반영
     */
    public void addCardTransactionToExpense(CardTransaction newCardTransaction, User user) {

        Expense newExpense = newCardTransaction.toEntity(user);
        expenseRepository.save(newExpense);

    }

}
