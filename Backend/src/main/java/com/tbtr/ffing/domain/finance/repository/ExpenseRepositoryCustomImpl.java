package com.tbtr.ffing.domain.finance.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.CategoryExpenseRes;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.finance.entity.QExpense;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExpenseRepositoryCustomImpl implements ExpenseRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ExpenseRes> findMonthlyExpenses(LocalDate startDate, LocalDate endDate, ExpenseCategory category) {
        QExpense expense = QExpense.expense;

        BooleanExpression dateCondition = expense.expenseDate.between(
                startDate.format(DateTimeFormatter.BASIC_ISO_DATE),
                endDate.format(DateTimeFormatter.BASIC_ISO_DATE)
        );

        BooleanExpression categoryCondition = category != null ?
                expense.expenseCategory.eq(category) : null;

        System.out.println(categoryCondition);

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

    @Override
    public List<CategoryExpenseRes> findWeeklyCategoryExpenses(LocalDate startDate, LocalDate endDate) {
        QExpense expense = QExpense.expense;

        // 카테고리별 총액 조회
        Map<ExpenseCategory, BigDecimal> categoryTotalMap = queryFactory
                .select(expense.expenseCategory, expense.expenseBalance.sum())
                .from(expense)
                .where(expense.expenseDate.between(
                        startDate.format(DateTimeFormatter.BASIC_ISO_DATE),
                        endDate.format(DateTimeFormatter.BASIC_ISO_DATE)))
                .groupBy(expense.expenseCategory)
                .fetch()
                .stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(expense.expenseCategory),
                        tuple -> tuple.get(expense.expenseBalance.sum())
                ));

        // 없는 카테고리는 0원으로 처리
        return Arrays.stream(ExpenseCategory.values())
                .map(category -> CategoryExpenseRes.builder()
                        .category(category)
                        .totalAmount(categoryTotalMap.getOrDefault(category, BigDecimal.ZERO))
                        .startDate(startDate)
                        .endDate(endDate)
                        .build())
                .collect(Collectors.toList());
    }
}