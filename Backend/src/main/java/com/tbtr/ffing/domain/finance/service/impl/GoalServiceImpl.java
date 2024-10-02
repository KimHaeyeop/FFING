package com.tbtr.ffing.domain.finance.service.impl;

import com.tbtr.ffing.domain.finance.dto.request.goal.GoalReq;
import com.tbtr.ffing.domain.finance.dto.response.goal.GoalRes;
import com.tbtr.ffing.domain.finance.dto.response.goal.SpendingRes;
import com.tbtr.ffing.domain.finance.entity.Goal;
import com.tbtr.ffing.domain.finance.repository.GoalRepository;
import com.tbtr.ffing.domain.finance.service.GoalService;
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
        // 1. 목표 자산 유효성 체크
        // 목표 자산 > 고정 수입 * 남은 개월 수 -> 불가능

        // 2. 목표 달성액 저장
        Goal goal = GoalReq.to(goalReq);
        goalRepository.save(goal);

        String goalBalance = goal.getBalance().toString();
        // 목표 소비액 파트 추가 해야함. (목표 자산 - 현재 총 자산) / 남은 개월 수
        SpendingRes spending = SpendingRes.builder()
                                          .leftMonths(12 - goal.getCreatedAt().getMonthValue() + 1)
                                          .spendingBalance("100").build();
        return GoalRes.builder()
                      .goalBalance(goalBalance)
                      .spending(spending).build();
    }

    @Override
    @Transactional
    public SpendingRes setSpending(GoalReq goalReq) {
        // 1. 목표 소비액 유효성 체크
        // 목표 소비액 < (목표 자산 - 현재 총 자산) / 남은 개월 수 -> 불가능

        // 2. 목표 소비액 저장
        Goal goal = GoalReq.to(goalReq);
        goalRepository.save(goal);

        return SpendingRes.builder()
                          .leftMonths(12 - goal.getCreatedAt().getMonthValue() + 1)
                          .spendingBalance(goalReq.getBalance()).build();
    }
}
