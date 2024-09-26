package com.tbtr.ffing.domain.finance.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;
import com.tbtr.ffing.domain.finance.entity.QExpense;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExpenseRepositoryCustomImpl implements ExpenseRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ExpenseRes> findMonthlyExpenses(LocalDate startDate, LocalDate endDate, String category) {
        QExpense expense = QExpense.expense;

        BooleanExpression dateCondition = expense.expenseDate.between(
                startDate.format(DateTimeFormatter.BASIC_ISO_DATE),
                endDate.format(DateTimeFormatter.BASIC_ISO_DATE)
        );

        BooleanExpression categoryCondition = category != null ?
                expense.expenseCategory.eq(category) : null;

        return queryFactory
                .select(Projections.constructor(ExpenseRes.class,
                        expense.expenseId,
                        expense.expenseName,
                        expense.expenseCategory,
                        expense.expenseMemo,
                        expense.expenseDate,
                        expense.expenseTime,
                        expense.expenseBalance))
                .from(expense)
                .where(dateCondition.and(categoryCondition))
                .fetch();
    }
}