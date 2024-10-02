package com.tbtr.ffing.domain.finance.repository;

import com.tbtr.ffing.domain.finance.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    // 사용자 ID와 연도, 목표 유형으로 목표 조회
    Goal findByUserIdAndGoalTypeAndYear(Long userId, String goalType, int year);

    // 사용자 ID와 월, 목표 유형으로 소비 조회
    Goal findByUserIdAndGoalTypeAndMonth(Long userId, String goalType, int month);
}
