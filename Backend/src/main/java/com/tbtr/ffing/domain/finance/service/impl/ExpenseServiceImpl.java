package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.response.expense.*;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.finance.repository.AccountTransactionRepository;
import com.tbtr.ffing.domain.finance.repository.ExpenseRepository;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final AccountTransactionRepository accountTransactionRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

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
     *
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
     *
     * @param isThisWeek
     * @return
     */
    @Override
    public WeeklyCategoryExpenseRes getWeeklyCategoryExpenses(boolean isThisWeek) {
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

        List<CategoryExpenseRes> categoryExpenses = expenseRepository.findCategoryExpenses(startDate, endDate);

        BigDecimal weeklyTotalAmount = categoryExpenses.stream()
                .map(CategoryExpenseRes::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return WeeklyCategoryExpenseRes.builder()
                .weeklyTotalAmount(weeklyTotalAmount)
                .categoryExpenses(categoryExpenses)
                .build();
    }

    /**
     * 월간 카테고리 총액
     *
     * @return
     */
    @Override
    public List<CategoryExpenseRes> getThisMonthCategoryExpenses() {

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.withDayOfMonth(1); // 이번 달의 첫 날
        LocalDate endDate = today.withDayOfMonth(today.lengthOfMonth()); // 이번 달의 마지막 날

        return expenseRepository.findCategoryExpenses(startDate, endDate);
    }

    /**
     * 월간(일간 포함) 지출액, 수입액 조회
     *
     * @param yearMonth
     * @return
     */
    @Override
    public MonthlySummaryRes getMonthlySummary(String yearMonth) {
        BigDecimal totalExpense = expenseRepository.getTotalExpenseForMonth(yearMonth);
        BigDecimal totalIncome = accountTransactionRepository.getTotalIncomeForMonth(yearMonth);
        List<DailySummaryRes> dailySummary = expenseRepository.getDailySummaryForMonth(yearMonth);

        return MonthlySummaryRes.builder()
                .yearMonth(yearMonth)
                .totalExpense(totalExpense != null ? totalExpense : BigDecimal.ZERO)
                .totalIncome(totalIncome != null ? totalIncome : BigDecimal.ZERO)
                .dailySummary(dailySummary)
                .build();
    }

    @Override
    public DailyExpenseRes getDailyExpense(String dateString) {
        LocalDate date = LocalDate.parse(dateString, DATE_FORMATTER);

        List<ExpenseRes> dailyExpenses = expenseRepository.findExpensesByDate(dateString);

        BigDecimal dailyTotal = expenseRepository.calculateTotalExpenseByDate(dateString);

        // 현재 날짜가 속한 주의 일요일을 시작일로 설정
        LocalDate startOfWeek = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        // 다음 주 토요일을 종료일로 설정
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        String startDateString = startOfWeek.format(DATE_FORMATTER);
        String endDateString = endOfWeek.format(DATE_FORMATTER);

        BigDecimal weeklyTotal = expenseRepository.calculateTotalExpenseBetweenDates(startDateString, endDateString);

        return DailyExpenseRes.builder()
                .date(dateString)
                .expenses(dailyExpenses)
                .dailyTotal(dailyTotal != null ? dailyTotal : BigDecimal.ZERO)
                .weeklyTotal(weeklyTotal != null ? weeklyTotal : BigDecimal.ZERO)
                .build();
    }

}
