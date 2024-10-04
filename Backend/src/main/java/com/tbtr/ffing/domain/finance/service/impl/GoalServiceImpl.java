package com.tbtr.ffing.domain.finance.service.impl;

import static com.tbtr.ffing.domain.finance.constants.GoalConstants.GOAL_TYPE_ASSET;
import static com.tbtr.ffing.domain.finance.constants.GoalConstants.GOAL_TYPE_SPENDING;

import com.tbtr.ffing.domain.finance.dto.request.goal.GoalReq;
import com.tbtr.ffing.domain.finance.dto.request.goal.SpendingReq;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalDetailRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.SpendingRes;
import com.tbtr.ffing.domain.finance.entity.Goal;
import com.tbtr.ffing.domain.finance.repository.AccountTransactionRepository;
import com.tbtr.ffing.domain.finance.repository.AssetRepository;
import com.tbtr.ffing.domain.finance.repository.GoalRepository;
import com.tbtr.ffing.domain.finance.service.GoalService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final AssetRepository assetRepository;
    private final AccountTransactionRepository accountTransactionRepository;

    @Override
    @Transactional
    public GoalDetailRes getGoal(Long userId, Long ssafyUserId) {
        LocalDate now = LocalDate.now();

        // 현재 총 자산 : asset 테이블에서 가져오기
        BigDecimal totalAsset = assetRepository.findCurrentAssetByUserId(userId).getTotalAsset();

        // 고정 수입 : 현재 기준 한 달 전 account_transaction 에서 transaction_type_name = 입금(고정) 에서 가져오기
        LocalDate previousMonth = now.minusMonths(1);
        String yearMonth = toYearMonths(previousMonth.getYear(), previousMonth.getMonthValue());

        BigDecimal fixedIncome = accountTransactionRepository.getTotalFixedIncomeForMonthBySsafyUserId(yearMonth,
                ssafyUserId);

        // 남은 개월 수
        int leftMonths = toLeftMonths(LocalDate.now().getMonthValue());

        // 최대 목표 자산
        BigDecimal totalAmount = totalAsset.add(fixedIncome.multiply(new BigDecimal(leftMonths)));

        // 상한선
        String upperLimitBalance = totalAmount.toString();

        // 하한선
        String lowerLimitBalance = totalAsset.toString();

        // 추천 금액 : 수입의 50%
        String recommendedGoalBalance =
                totalAsset.add(fixedIncome.multiply(new BigDecimal(leftMonths)).multiply(new BigDecimal(
                        "10")).divide(new BigDecimal("20"), 0, RoundingMode.CEILING)).toString();
        return GoalDetailRes.builder()
                            .totalAsset(totalAsset.toString())
                            .leftMonths(leftMonths)
                            .fixedIncome(fixedIncome.toString())
                            .recommendedGoalBalance(recommendedGoalBalance)
                            .lowerLimitBalance(lowerLimitBalance)
                            .upperLimitBalance(upperLimitBalance).build();
    }

    @Override
    @Transactional
    public GoalRes setGoal(GoalReq goalReq) {
        // 현재 년도 및 월 정보 가져오기
        LocalDate now = LocalDate.now();
        String year = now.getYear() + "";
        String yearMonth = toYearMonths(now.getYear(), now.getMonthValue());

        // 해당 년도에 목표가 존재하는지 확인
        deleteExistingGoal(goalReq.getUserId(), GOAL_TYPE_ASSET, year);

        // 해당 월에 소비 목표가 존재하는지 확인 후 제거
        deleteExistingGoal(goalReq.getUserId(), GOAL_TYPE_SPENDING, yearMonth);

        // 목표 자산, 소비액 저장
        Goal goal = GoalReq.goalTo(goalReq);
        Goal spending = GoalReq.spendingTo(goalReq);
        goalRepository.save(goal);
        goalRepository.save(spending);

        // 응답 생성
        int leftMonths = toLeftMonths(goal.getCreatedAt().getMonthValue());
        String spendingBalance = spending.getBalance().toString();
        SpendingRes spendingRes = SpendingRes.of(leftMonths, spendingBalance);

        return GoalRes.of(goal.getBalance().toString(), spendingRes);
    }

    @Override
    @Transactional
    public SpendingRes setSpending(SpendingReq spendingReq) {
        LocalDate now = LocalDate.now();
        // 해당 월에 소비 목표가 존재하는지 확인 후 제거
        deleteExistingGoal(spendingReq.getUserId(), GOAL_TYPE_SPENDING,
                toYearMonths(now.getYear(), now.getMonthValue()));

        // 목표 소비액 저장
        Goal goal = SpendingReq.spendingTo(spendingReq);
        goalRepository.save(goal);

        // 응답 생성
        int leftMonths = toLeftMonths(goal.getCreatedAt().getMonthValue());
        String spendingBalance = goal.getBalance().toString();

        return SpendingRes.of(leftMonths, spendingBalance);
    }

    private void deleteExistingGoal(Long userId, String goalType, String date) {
        Goal existingGoal = null;
        if (date.length() == 4) {
            existingGoal = goalRepository.findByUserIdAndGoalTypeAndYear(userId, goalType, date);
        } else if (date.length() == 6) {
            existingGoal = goalRepository.findByUserIdAndGoalTypeAndYearMonth(userId, goalType, date);
        }

        if (existingGoal != null) {
            goalRepository.delete(existingGoal);
        }
    }

    private int toLeftMonths(int month) {
        return 12 - month + 1;
    }

    private String toYearMonths(int year, int month) {
        return year + String.format("%02d", month);
    }
}
