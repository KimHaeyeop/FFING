package com.tbtr.ffing.domain.finance.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.finance.dto.response.expense.DailySummaryRes;
import com.tbtr.ffing.domain.finance.entity.QAccountTransaction;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountTransactionRepositoryCustomImpl implements AccountTransactionRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public BigDecimal getTotalIncomeForMonth(String yearMonth) {
        QAccountTransaction transaction = QAccountTransaction.accountTransaction;
        return queryFactory
                .select(transaction.transactionBalance.sum())
                .from(transaction)
                .where(transaction.transactionDate.startsWith(yearMonth)
                        .and(transaction.transactionType.eq("1")))
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
