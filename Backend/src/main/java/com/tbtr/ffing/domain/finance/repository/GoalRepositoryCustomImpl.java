package com.tbtr.ffing.domain.finance.repository;

import static com.tbtr.ffing.domain.finance.constants.GoalConstants.GOAL_TYPE_ASSET;
import static com.tbtr.ffing.domain.finance.constants.GoalConstants.GOAL_TYPE_SPENDING;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.finance.entity.Goal;
import com.tbtr.ffing.domain.finance.entity.QGoal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GoalRepositoryCustomImpl implements GoalRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Goal findGoalByUserIdAndYear(Long userId, String year) {
        QGoal transaction = QGoal.goal;
        return queryFactory
                .selectFrom(transaction)
                .where(
                        transaction.userId.eq(userId) // 사용자 ID 조건
                                          .and(transaction.goalType.eq(GOAL_TYPE_ASSET)) // 목표 유형 조건
                                          .and(transaction.createdAt.year().eq(Integer.parseInt(year))) // 생성 연도 조건
                )
                .fetchOne(); // 단일 결과를 반환
    }

    @Override
    public Goal findSpendingByUserIdAndYearMonth(Long userId, String yearMonth) {
        QGoal transaction = QGoal.goal; // QGoal 인스턴스 생성

        // 연도와 월 추출
        String year = yearMonth.substring(0, 4); // 2024
        String month = yearMonth.substring(4, 6); // 09

        return queryFactory
                .selectFrom(transaction)
                .where(
                        transaction.userId.eq(userId) // 사용자 ID 조건
                                          .and(transaction.goalType.eq(GOAL_TYPE_SPENDING)) // 목표 유형 조건
                                          .and(transaction.createdAt.year().eq(Integer.parseInt(year))) // 생성 연도 조건
                                          .and(transaction.createdAt.month().eq(Integer.parseInt(month))) // 생성 월 조건
                )
                .fetchOne(); // 단일 결과를 반환
    }

    @Override
    public Goal findFirstSpendingByUserId(Long userId, String year) {
        QGoal transaction = QGoal.goal;

        return queryFactory
                .selectFrom(transaction)
                .where(
                        transaction.userId.eq(userId) // 사용자 ID 조건
                                          .and(transaction.goalType.eq("2")) // 소비 목표 유형 조건
                                          .and(transaction.createdAt.year().eq(LocalDate.now().getYear())) // 올해 조건
                )
                .orderBy(transaction.createdAt.asc()) // 생성일 기준으로 정렬
                .fetchFirst();
    }
}
