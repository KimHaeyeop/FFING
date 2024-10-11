package com.tbtr.ffing.domain.finance.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.finance.dto.response.expense.DailySummaryRes;
import com.tbtr.ffing.domain.finance.entity.QAccountTransaction;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountTransactionRepositoryCustomImpl implements AccountTransactionRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public BigDecimal getTotalIncomeForMonth(String yearMonth, Long ssafyUserId) {
        QAccountTransaction transaction = QAccountTransaction.accountTransaction;
        return queryFactory
                .select(transaction.transactionBalance.sum())
                .from(transaction)
                .where(
                        transaction.account.ssafyUser.ssafyUserId.eq(ssafyUserId),
                        transaction.transactionDate.startsWith(yearMonth)
                                                  .and(transaction.transactionType.eq("1")))
                .fetchOne();
    }

    @Override
    public BigDecimal getTotalFixedIncomeForYearMonthBySsafyUserId(String yearMonth, Long ssafyUserId) {
        QAccountTransaction transaction = QAccountTransaction.accountTransaction;
        return queryFactory
                .select(transaction.transactionBalance.sum().coalesce(BigDecimal.ZERO))
                .from(transaction)
                .where(transaction.account.ssafyUser.ssafyUserId.eq(ssafyUserId)
                                                                .and(transaction.transactionTypeName.eq("입금(고정)"))
                                                                .and(transaction.transactionDate.startsWith(yearMonth)))
                .fetchOne();
    }

    @Override
    public List<DailySummaryRes> getDailyIncomesForMonth(String yearMonth) {
        QAccountTransaction transaction = QAccountTransaction.accountTransaction;
        return queryFactory
                .select(Projections.constructor(DailySummaryRes.class,
                        transaction.transactionDate,
                        transaction.transactionBalance.sum()))
                .from(transaction)
                .where(transaction.transactionDate.startsWith(yearMonth)
                                                  .and(transaction.transactionType.eq("1")))
                .groupBy(transaction.transactionDate)
                .fetch();
    }

}
