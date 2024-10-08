package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.response.expense.CategoryExpenseRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.DailyExpenseRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.DailySummaryRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.MonthlyExpenseAnalysisRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.MonthlySummaryRes;
import com.tbtr.ffing.domain.finance.dto.response.expense.WeeklyCategoryExpenseRes;
import com.tbtr.ffing.domain.finance.entity.AccountTransaction;
import com.tbtr.ffing.domain.finance.entity.CardTransaction;
import com.tbtr.ffing.domain.finance.entity.Expense;
import com.tbtr.ffing.domain.finance.entity.ExpenseCategory;
import com.tbtr.ffing.domain.finance.entity.Goal;
import com.tbtr.ffing.domain.finance.repository.AccountTransactionRepository;
import com.tbtr.ffing.domain.finance.repository.AssetRepository;
import com.tbtr.ffing.domain.finance.repository.ExpenseRepository;
import com.tbtr.ffing.domain.finance.repository.GoalRepository;
import com.tbtr.ffing.domain.finance.service.ExpenseService;
import com.tbtr.ffing.domain.user.entity.User;
import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final DateTimeFormatter DATE_FORMATTER_YEARMONTH = DateTimeFormatter.ofPattern("yyyyMM");
    private final ExpenseRepository expenseRepository;
    private final AccountTransactionRepository accountTransactionRepository;
    private final GoalRepository goalRepository;
    private final AssetRepository assetRepository;

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

    /**
     * 월별(6개월 간) 지출액 확인 및 월간 지출 분석
     */
    @Override
    public MonthlyExpenseAnalysisRes getAnalysisSummary(Long userId, Long ssafyUserId) {
        // 현재 날짜
        LocalDate now = LocalDate.now();
        // 6개월간 소비액 계산
        List<BigDecimal> sixMonthTotalExpense = calculateSixMonthTotalExpense();

        // 저번달 대비 이번달 소비액 증감률 또는 차이값 계산
        BigDecimal monthOverMonthChange = calculateMonthOverMonthChange(sixMonthTotalExpense);

        // 올해 총 소비액 계산
        BigDecimal yearlyTotalExpense = calculateYearlyTotalExpense();

        // 총 목표 소비액 계산: 올해 처음 목표 소비액 * 당시 남은 개월 수
        Goal firstSpendingGoal = goalRepository.findFirstSpendingByUserId(userId, String.valueOf(now.getYear()));
        BigDecimal totalTargetExpense = calculateTotalTargetExpense(firstSpendingGoal);

        // 5개월간 평균 소비액 계산
        BigDecimal monthAverageExpense = calculateMonthAverageExpense(sixMonthTotalExpense);

        // 이번달 목표 소비액
        Goal recentSpendingGoal = goalRepository.findFirstSpendingByUserId(userId,
                String.valueOf(LocalDate.now().getYear()));
        BigDecimal monthlyTargetExpense =
                recentSpendingGoal == null ? BigDecimal.ZERO : recentSpendingGoal.getBalance();

        // 앞으로의 매달 소비액 계산
        Goal yearGoal = goalRepository.findGoalByUserIdAndYear(userId, String.valueOf(now.getYear()));
        BigDecimal futureMonthlyExpenses = calculateFutureMonthlyExpenses(userId, ssafyUserId, yearGoal);

        return MonthlyExpenseAnalysisRes.builder()
                                        .sixMonthTotalExpense(sixMonthTotalExpense)
                                        .monthOverMonthChange(monthOverMonthChange)
                                        .yearlyTotalExpense(yearlyTotalExpense)
                                        .totalTargetExpense(totalTargetExpense)
                                        .monthAverageExpense(monthAverageExpense)
                                        .monthlyTargetExpense(monthlyTargetExpense)
                                        .futureMonthlyExpenses(futureMonthlyExpenses)
                                        .build();
    }

    private List<BigDecimal> calculateSixMonthTotalExpense() {
        List<BigDecimal> sixMonthTotalExpense = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();

        for (int i = 5; i >= 0; i--) {
            LocalDate targetDate = currentDate.minusMonths(i);
            String yearMonth = targetDate.format(DATE_FORMATTER_YEARMONTH);
            BigDecimal monthExpense = expenseRepository.getTotalExpenseForMonth(yearMonth);
            sixMonthTotalExpense.add(monthExpense == null ? BigDecimal.ZERO : monthExpense);
        }
        return sixMonthTotalExpense;
    }

    private BigDecimal calculateMonthOverMonthChange(List<BigDecimal> sixMonthTotalExpense) {
        if (sixMonthTotalExpense.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return sixMonthTotalExpense.get(5).subtract(sixMonthTotalExpense.get(4));
    }

    private BigDecimal calculateYearlyTotalExpense() {
        LocalDate currentDate = LocalDate.now();
        String startDate = currentDate.withDayOfYear(1).format(DATE_FORMATTER);
        String endDate = currentDate.format(DATE_FORMATTER);
        return expenseRepository.calculateTotalExpenseBetweenDates(startDate, endDate);
    }

    private BigDecimal calculateTotalTargetExpense(Goal firstSpendingGoal) {
        if (firstSpendingGoal == null) {
            return BigDecimal.ZERO;
        }
        int remainingMonths = 12 - firstSpendingGoal.getCreatedAt().getMonthValue() + 1;
        return firstSpendingGoal.getBalance().multiply(new BigDecimal(remainingMonths));
    }

    private BigDecimal calculateMonthAverageExpense(List<BigDecimal> sixMonthTotalExpense) {
        BigDecimal total = BigDecimal.ZERO;
        for (int i = 0; i < 5; i++) {
            total = total.add(sixMonthTotalExpense.get(i));
        }
        return total.divide(new BigDecimal(5), BigDecimal.ROUND_HALF_UP);
    }

    private BigDecimal calculateFutureMonthlyExpenses(Long userId, Long ssafyUserId, Goal yearGoal) {
        if (yearGoal == null) {
            return BigDecimal.ZERO;
        }

        LocalDate currentDate = LocalDate.now();
        String lastMonth = currentDate.minusMonths(1).format(DATE_FORMATTER_YEARMONTH);

        BigDecimal fixedIncome = accountTransactionRepository.getTotalFixedIncomeForYearMonthBySsafyUserId(lastMonth,
                ssafyUserId);
        BigDecimal currentAsset = assetRepository.findCurrentAssetByUserId(userId).getTotalAsset();

        int remainingMonths = 12 - currentDate.getMonthValue() + 1;
        return fixedIncome.multiply(new BigDecimal(remainingMonths))
                          .subtract(yearGoal.getBalance().subtract(currentAsset));
    }
//    @Override
//    public MonthlyExpenseAnalysisRes getAnalysisSummary(Long userId, Long ssafyUserId) {
//        // 이번달 포함 6개월간의 소비액 (리스트 형태로 6개의 값 저장)
//        List<BigDecimal> sixMonthTotalExpense = new ArrayList<>();
//
//        LocalDate currentDate = LocalDate.now();
//        for (int i = 5; i >= 0; i--) {
//            LocalDate targetDate = currentDate.minusMonths(i);
//            String yearMonth = targetDate.format(DATE_FORMATTER_YEARMONTH);
//            BigDecimal monthExpense = expenseRepository.getTotalExpenseForMonth(yearMonth);
//            BigDecimal input = monthExpense == null ? BigDecimal.ZERO : monthExpense;
//            sixMonthTotalExpense.add(input);
//        }
//
//        // 저번달 대비 이번달 소비액 증감률 또는 차이값
//        BigDecimal monthOverMonthChange = sixMonthTotalExpense.isEmpty() ? BigDecimal.ZERO : sixMonthTotalExpense.get(5)
//                                                                                                                 .subtract(
//                                                                                                                         sixMonthTotalExpense.get(
//                                                                                                                                 4));
//
//        // 올해 총소비액
//        String startDate = currentDate.withDayOfYear(1).format(DATE_FORMATTER);
//        String endDate = currentDate.format(DATE_FORMATTER);
//        BigDecimal yearlyTotalExpense = expenseRepository.calculateTotalExpenseBetweenDates(startDate, endDate);
//
//        // 총 목표 소비액 : 올해 처음 목표 소비액 * 당시 남은 개월 수
//        Goal targetSpending = goalRepository.findFirstSpendingByUserId(userId, String.valueOf(currentDate.getYear()));
//        BigDecimal totalTargetExpense = targetSpending == null ? BigDecimal.ZERO : targetSpending.getBalance().multiply(
//                new BigDecimal(12 - targetSpending.getCreatedAt().getMonthValue() + 1));
//
//        // 5개월(이번 달 제외한 5개월) 평균 소비액
//        BigDecimal monthAverageExpense = BigDecimal.ZERO;
//        for (int i = 5; i > 0; i--) {
//            monthAverageExpense = monthAverageExpense.add(sixMonthTotalExpense.get(i));
//        }
//        monthAverageExpense = monthAverageExpense.divide(new BigDecimal(5));
//
//        // 이번달 목표 소비액
//        Goal monthSpending = goalRepository.findFirstSpendingByUserId(userId, String.valueOf(currentDate.getYear()));
//        BigDecimal monthlyTargetExpense = monthSpending == null ? BigDecimal.ZERO : monthSpending.getBalance();
//
//        // 앞으로의 매달 소비액 : 고정 수입*남은 개월 - (목표 자산 - 현재 자산) / 남은 개월
//
//        System.out.println("###############" + currentDate.format(DATE_FORMATTER_YEARMONTH));
//        Goal yearGoal = goalRepository.findByUserIdAndGoalTypeAndYear(userId, String.valueOf(currentDate.getYear()));
//        BigDecimal futureMonthlyExpenses = yearGoal == null ? BigDecimal.ZERO :
//                                           accountTransactionRepository.getTotalFixedIncomeForYearMonthBySsafyUserId(
//                                                                               currentDate.minusMonths(1L).format(DATE_FORMATTER_YEARMONTH),
//                                                                               ssafyUserId).multiply(
//                                                                               new BigDecimal(12 - currentDate.getMonthValue() + 1))
//                                                                       .subtract(yearGoal.getBalance().subtract(
//                                                                               assetRepository.findCurrentAssetByUserId(
//                                                                                       userId).getTotalAsset()));
//
//        return MonthlyExpenseAnalysisRes.builder()
//                                        .sixMonthTotalExpense(sixMonthTotalExpense)
//                                        .monthOverMonthChange(monthOverMonthChange)
//                                        .yearlyTotalExpense(yearlyTotalExpense)
//                                        .totalTargetExpense(totalTargetExpense)
//                                        .monthAverageExpense(monthAverageExpense)
//                                        .monthlyTargetExpense(monthlyTargetExpense)
//                                        .futureMonthlyExpenses(futureMonthlyExpenses).build();
//    }
//
}
