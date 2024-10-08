package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.Goal;

public interface GoalRepositoryCustom {

    Goal findGoalByUserIdAndYear(Long userId, String year);

    Goal findSpendingByUserIdAndYearMonth(Long userId, String yearMonth);

    // 해당 연도의 첫 번째 목표 소비액
    Goal findFirstSpendingByUserId(Long userId, String year);
}