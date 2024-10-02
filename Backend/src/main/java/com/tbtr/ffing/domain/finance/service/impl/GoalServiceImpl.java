package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.request.goal.GoalReq;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalDetailRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.SpendingRes;
import com.tbtr.ffing.domain.finance.entity.Goal;
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

    @Override
    @Transactional
    public GoalRes setGoal(GoalReq goalReq) {
        // 목표 자산, 소비액 저장
        Goal goal = GoalReq.goalTo(goalReq);
        Goal spending = GoalReq.spendingTo(goalReq);
        goalRepository.save(goal);
        goalRepository.save(spending);

        SpendingRes spendingRes = SpendingRes.builder()
                                             .leftMonths(12 - goal.getCreatedAt().getMonthValue() + 1)
                                             .spendingBalance(goal.getBalance().toString()).build();

        return GoalRes.builder()
                      .goalBalance(goal.getBalance().toString())
                      .spending(spendingRes).build();
    }

    @Override
    @Transactional
    public SpendingRes setSpending(GoalReq goalReq) {
        // 목표 소비액 저장
        Goal goal = GoalReq.spendingTo(goalReq);
        goalRepository.save(goal);

        return SpendingRes.builder()
                          .leftMonths(12 - goal.getCreatedAt().getMonthValue() + 1)
                          .spendingBalance(goal.getBalance().toString()).build();
    }

    @Override
    @Transactional
    public GoalDetailRes getGoal(Long userId) {
        // 현재 총 자산 : asset 테이블에서 가져오기
        BigDecimal totalAsset = new BigDecimal(10000000);

        // 고정 수입 : 현재 기준 한 달 전 account_transaction 에서 transaction_type_name = 입금(고정) 에서 가져오기
        BigDecimal fixedIncome = new BigDecimal(4000000);

        // 남은 개월 수
        int leftMonths = 12 - LocalDate.now().getMonthValue() + 1;

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

}
