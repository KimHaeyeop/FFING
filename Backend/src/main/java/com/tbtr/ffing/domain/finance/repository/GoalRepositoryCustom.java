package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.Goal;

public interface GoalRepositoryCustom {

    Goal findByUserIdAndGoalTypeAndYear(Long userId, String goalType, String year);

    Goal findByUserIdAndGoalTypeAndYearMonth(Long userId, String goalType, String yearMonth);
}
