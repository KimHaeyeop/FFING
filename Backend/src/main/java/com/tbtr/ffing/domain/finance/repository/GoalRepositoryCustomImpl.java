package com.tbtr.ffing.domain.finance.repository;

import static com.tbtr.ffing.domain.finance.constants.GoalConstants.GOAL_TYPE_ASSET;
import static com.tbtr.ffing.domain.finance.constants.GoalConstants.GOAL_TYPE_SPENDING;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.finance.entity.Goal;
import com.tbtr.ffing.domain.finance.entity.QGoal;
import java.math.BigDecimal;
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
                        transaction.user.userId.eq(userId)
                                               .and(transaction.goalType.eq(GOAL_TYPE_ASSET))
                                               .and(transaction.createdAt.year().eq(Integer.parseInt(year)))
                )
                .fetchFirst();
    }

    @Override
    public Goal findSpendingByUserIdAndYearMonth(Long userId, String yearMonth) {
        QGoal transaction = QGoal.goal;

        // 연도와 월 추출
        String year = yearMonth.substring(0, 4);
        String month = yearMonth.substring(4, 6);

        return queryFactory
                .selectFrom(transaction)
                .where(
                        transaction.user.userId.eq(userId)
                                               .and(transaction.goalType.eq(GOAL_TYPE_SPENDING))
                                               .and(transaction.createdAt.year().eq(Integer.parseInt(year)))
                                               .and(transaction.createdAt.month().eq(Integer.parseInt(month)))
                )
                .fetchFirst();
    }

    @Override
    public Goal findFirstSpendingByUserIdAndThisYear(Long userId, String year) {
        QGoal transaction = QGoal.goal;

        return queryFactory
                .selectFrom(transaction)
                .where(
                        transaction.user.userId.eq(userId)
                                               .and(transaction.goalType.eq("2"))
                                               .and(transaction.createdAt.year().eq(LocalDate.now().getYear()))
                )
                .orderBy(transaction.createdAt.asc())
                .fetchFirst();
    }

    @Override
    public BigDecimal findRecentSpendingBalanceByUserId(Long userId) {
        QGoal transaction = QGoal.goal;

        BigDecimal result = queryFactory
                .select(transaction.balance)
                .from(transaction)
                .where(
                        transaction.user.userId.eq(userId)
                                               .and(transaction.goalType.eq("2"))
                                               .and(transaction.createdAt.year().eq(LocalDate.now().getYear()))
                )
                .orderBy(transaction.createdAt.desc())
                .fetchFirst();
        return result == null ? BigDecimal.ZERO : result;
    }

    @Override
    public BigDecimal findGoalBalanceByUserIdAndThisYear(Long userId) {
        QGoal transaction = QGoal.goal;

        BigDecimal result = queryFactory
                .select(transaction.balance)
                .from(transaction)
                .where(
                        transaction.user.userId.eq(userId)
                                               .and(transaction.goalType.eq(GOAL_TYPE_ASSET))
                                               .and((transaction.createdAt.year().eq(LocalDate.now().getYear())))
                )
                .orderBy(transaction.createdAt.desc())
                .fetchFirst();
        return result == null ? BigDecimal.ZERO : result;
    }
}
