package com.tbtr.ffing.domain.finance.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.finance.dto.response.expense.DailySummaryRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.CategoryExpenseRes;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.finance.entity.QAccountTransaction;
import com.tbtr.ffing.domain.finance.entity.QExpense;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.LinkedHashMap;
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
    public List<CategoryExpenseRes> findCategoryExpenses(LocalDate startDate, LocalDate endDate) {
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

    @Override
    public BigDecimal getTotalExpenseForMonth(String yearMonth) {

        QExpense expense = QExpense.expense;
        return queryFactory
                .select(expense.expenseBalance.sum())
                .from(expense)
                .where(expense.expenseDate.startsWith(yearMonth))
                .fetchOne();
    }

    @Override
    public List<DailySummaryRes> getDailyExpensesForMonth(String yearMonth) {

        QExpense expense = QExpense.expense;
        return queryFactory
                .select(Projections.constructor(DailySummaryRes.class,
                        expense.expenseDate,
                        expense.expenseBalance.sum()))
                .from(expense)
                .where(expense.expenseDate.startsWith(yearMonth))
                .groupBy(expense.expenseDate)
                .fetch();
    }

    @Override
    public List<DailySummaryRes> getDailySummaryForMonth(String yearMonth) {
        QExpense expense = QExpense.expense;
        QAccountTransaction transaction = QAccountTransaction.accountTransaction;

        LocalDate startDate = LocalDate.parse(yearMonth + "01", DateTimeFormatter.BASIC_ISO_DATE);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        // 모든 날짜 생성
        List<LocalDate> allDatesInMonth = startDate.datesUntil(endDate.plusDays(1))
                .collect(Collectors.toList());

        // 지출 데이터 조회
        Map<LocalDate, BigDecimal> expenseMap = queryFactory
                .select(expense.expenseDate, expense.expenseBalance.sum())
                .from(expense)
                .where(expense.expenseDate.between(
                        startDate.format(DateTimeFormatter.BASIC_ISO_DATE),
                        endDate.format(DateTimeFormatter.BASIC_ISO_DATE)))
                .groupBy(expense.expenseDate)
                .fetch()
                .stream()
                .collect(Collectors.toMap(
                        tuple -> LocalDate.parse(tuple.get(expense.expenseDate), DateTimeFormatter.BASIC_ISO_DATE),
                        tuple -> tuple.get(expense.expenseBalance.sum()),
                        (v1, v2) -> v1,
                        LinkedHashMap::new
                ));

        // 수입 데이터 조회
        Map<LocalDate, BigDecimal> incomeMap = queryFactory
                .select(transaction.transactionDate, transaction.transactionBalance.sum())
                .from(transaction)
                .where(transaction.transactionDate.between(
                                startDate.format(DateTimeFormatter.BASIC_ISO_DATE),
                                endDate.format(DateTimeFormatter.BASIC_ISO_DATE))
                        .and(transaction.transactionType.eq("1")))
                .groupBy(transaction.transactionDate)
                .fetch()
                .stream()
                .collect(Collectors.toMap(
                        tuple -> LocalDate.parse(tuple.get(transaction.transactionDate), DateTimeFormatter.BASIC_ISO_DATE),
                        tuple -> tuple.get(transaction.transactionBalance.sum()),
                        (v1, v2) -> v1,
                        LinkedHashMap::new
                ));

        // 결과 생성
        return allDatesInMonth.stream()
                .map(date -> new DailySummaryRes(
                        date.format(DateTimeFormatter.BASIC_ISO_DATE),
                        expenseMap.getOrDefault(date, BigDecimal.ZERO),
                        incomeMap.getOrDefault(date, BigDecimal.ZERO)
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<ExpenseRes> findExpensesByDate(String date) {
        QExpense expense = QExpense.expense;
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
                .where(expense.expenseDate.eq(date))
                .fetch();
    }

    @Override
    public List<ExpenseRes> findExpensesBetweenDates(String startDate, String endDate) {
        QExpense expense = QExpense.expense;
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
                .where(expense.expenseDate.between(startDate, endDate))
                .fetch();
    }

    @Override
    public BigDecimal calculateTotalExpenseByDate(String date) {
        QExpense expense = QExpense.expense;
        BigDecimal total = queryFactory
                .select(expense.expenseBalance.sum())
                .from(expense)
                .where(expense.expenseDate.eq(date))
                .fetchOne();
        return total != null ? total : BigDecimal.ZERO;
    }

    @Override
    public BigDecimal calculateTotalExpenseBetweenDates(String startDate, String endDate) {
        QExpense expense = QExpense.expense;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDate start = LocalDate.parse(startDate, formatter);
        LocalDate end = LocalDate.parse(endDate, formatter);

        List<String> dateRange = start.datesUntil(end.plusDays(1))
                .map(date -> date.format(formatter))
                .collect(Collectors.toList());

        BigDecimal total = queryFactory
                .select(expense.expenseBalance.sum())
                .from(expense)
                .where(expense.expenseDate.in(dateRange))
                .fetchOne();
        return total != null ? total : BigDecimal.ZERO;
    }


}