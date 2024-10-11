package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.Goal;
import java.math.BigDecimal;

public interface GoalRepositoryCustom {

    Goal findGoalByUserIdAndYear(Long userId, String year);

    Goal findSpendingByUserIdAndYearMonth(Long userId, String yearMonth);

    // 해당 연도의 첫 번째 목표 소비액
    Goal findFirstSpendingByUserIdAndThisYear(Long userId, String year);

    // 올해 최근 목표 소비액
    BigDecimal findRecentSpendingBalanceByUserId(Long userId);

    // 올해 목표 자산액
    BigDecimal findGoalBalanceByUserIdAndThisYear(Long userId);
}