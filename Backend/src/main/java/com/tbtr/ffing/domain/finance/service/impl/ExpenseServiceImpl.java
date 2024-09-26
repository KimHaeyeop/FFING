package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.CategoryExpenseRes;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.finance.repository.ExpenseRepository;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    /**
     * 카드 지출 -> 전체 지출에 반영
     */
    @Override
    @Transactional
    public void addCardTransactionToExpense(CardTransaction newCardTransaction, User user) {

        Expense newExpense = newCardTransaction.toEntity(user);
        expenseRepository.save(newExpense);

    }

    /**
     * 계좌이체(출금(이체)) -> 전체 지출에 반영
     */
    @Override
    @Transactional
    public void addAccountTransferToExpense(AccountTransaction newAccountTransaction, User user) {

        Expense newExpense = newAccountTransaction.toEntity(user);
        expenseRepository.save(newExpense);



    }

    /**
     * 당월 지출내역
     * @param category
     * @return
     */
    @Override
    public List<ExpenseRes> getMonthlyExpenses(ExpenseCategory category) {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate endOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        return expenseRepository.findMonthlyExpenses(startOfMonth, endOfMonth, category);
    }

    /**
     * 주간 카테고리별 지출액
     * @param isThisWeek
     * @return
     */
    @Override
    public List<CategoryExpenseRes> getWeeklyCategoryExpenses(boolean isThisWeek) {
        LocalDate today = LocalDate.now();
        LocalDate startDate;
        LocalDate endDate;

        if (isThisWeek) {
            startDate = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
            endDate = startDate.plusDays(6); // Saturday
        } else {
            startDate = today.minusWeeks(1).with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
            endDate = startDate.plusDays(6); // Saturday
        }

        return expenseRepository.findWeeklyCategoryExpenses(startDate, endDate);
    }


}
