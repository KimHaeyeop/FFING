package com.tbtr.ffing.domain.finance.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.finance.dto.response.asset.*;
import com.tbtr.ffing.domain.finance.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AssetRepositoryImpl implements AssetRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final SecurityFilterChain defaultSecurityFilterChain;

    @Override
    public AssetRes findCurrentAssetByUserId(long userId) {
        QAsset asset = QAsset.asset;

        return queryFactory
                .select(Projections.constructor(AssetRes.class,
                        asset.assetId,
                        asset.totalAsset,
                        asset.accountBalance,
                        asset.depositSavingsBalance,
                        asset.stockBalance,
                        asset.othersBalance,
                        asset.updatedDate))
                .from(asset)
                .where(asset.user.userId.eq(userId))
                .limit(1)
                .fetchOne();
    }

    @Override
    public AssetRes findRecentAssetByUserId(Long userId) {
        QAsset asset = QAsset.asset;

        return queryFactory
                .select(Projections.constructor(AssetRes.class,
                        asset.assetId,
                        asset.totalAsset,
                        asset.accountBalance,
                        asset.depositSavingsBalance,
                        asset.stockBalance,
                        asset.othersBalance,
                        asset.updatedDate))
                .from(asset)
                .where(asset.user.userId.eq(userId))
                .orderBy(asset.updatedDate.desc())
                .limit(1)
                .fetchOne();
    }

    @Override
    public List<AssetRes> findAssetHistoryByUserId(long userId) {
        QAsset asset = QAsset.asset;

        return queryFactory
                .select(Projections.constructor(AssetRes.class,
                        asset.assetId,
                        asset.totalAsset,
                        asset.accountBalance,
                        asset.depositSavingsBalance,
                        asset.stockBalance,
                        asset.othersBalance,
                        asset.updatedDate))
                .from(asset)
                .where(asset.user.userId.eq(userId))
                .limit(6)
                .fetch();
    }

    @Override
    public List<DepositAssetRes> findDepositAssetListByUserId(long ssafyUserId) {
        QDepositAccount depositAccount = QDepositAccount.depositAccount;

        return queryFactory
                .select(Projections.constructor(DepositAssetRes.class,
                        depositAccount.depositAccountId,
                        depositAccount.bankCode,
                        depositAccount.accountName,
                        depositAccount.accountNo,
                        depositAccount.totalBalance))
                .from(depositAccount)
                .where(depositAccount.ssafyUser.ssafyUserId.eq(ssafyUserId))
                .fetch();
    }

    @Override
    public List<SavingsAssetRes> findSavingsAssetListByUserId(long ssafyUserId) {
        QSavingsAccount savingsAccount = QSavingsAccount.savingsAccount;

        return queryFactory
                .select(Projections.constructor(SavingsAssetRes.class,
                        savingsAccount.savingsAccountId,
                        savingsAccount.bankCode,
                        savingsAccount.accountName,
                        savingsAccount.accountNo,
                        savingsAccount.totalBalance))
                .from(savingsAccount)
                .where(savingsAccount.ssafyUser.ssafyUserId.eq(ssafyUserId))
                .fetch();
    }

    @Override
    public List<AccountAssetRes> findAccountAssetListByUserId(long ssafyUserId) {
        QAccount account = QAccount.account;

        return queryFactory
                .select(Projections.constructor(AccountAssetRes.class,
                        account.accountId,
                        account.bankCode,
                        account.accountName,
                        account.accountNo,
                        account.accountBalance))
                .from(account)
                .where(account.ssafyUser.ssafyUserId.eq(ssafyUserId))
                .fetch();
    }

    @Override
    public List<DepositTransactionAssetRes> findDepositTransactionByDepositAccountId(long accountId) {
        QDepositTransaction depositTransaction = QDepositTransaction.depositTransaction;

        return queryFactory
                .select(Projections.constructor(DepositTransactionAssetRes.class,
                        depositTransaction.depositTransactionId,
                        depositTransaction.paymentDate,
                        depositTransaction.paymentTime,
                        depositTransaction.paymentBalance,
                        Expressions.numberTemplate(BigDecimal.class,
                                "SUM({0}) OVER (ORDER BY {1})",
                                depositTransaction.paymentBalance, depositTransaction.depositTransactionId)))
                .from(depositTransaction)
                .where(depositTransaction.depositAccount.depositAccountId.eq(accountId))
                .orderBy(depositTransaction.paymentDate.desc(), depositTransaction.paymentTime.desc())
                .fetch();
    }

    @Override
    public List<SavingsTransactionAssetRes> findSavingsTransactionBySavingsAccountId(long accountId) {
        QSavingsTransaction savingsTransaction = QSavingsTransaction.savingsTransaction;

        return queryFactory
                .select(Projections.constructor(SavingsTransactionAssetRes.class,
                        savingsTransaction.savingsTransactionId,
                        savingsTransaction.paymentDate,
                        savingsTransaction.paymentTime,
                        savingsTransaction.depositInstallment,
                        savingsTransaction.paymentBalance,
                        Expressions.numberTemplate(BigDecimal.class,
                                "SUM({0}) OVER (ORDER BY {1})",
                                savingsTransaction.paymentBalance, savingsTransaction.savingsTransactionId)))
                .from(savingsTransaction)
                .where(savingsTransaction.savingsAccount.savingsAccountId.eq(accountId))
                .orderBy(savingsTransaction.paymentDate.desc(), savingsTransaction.paymentTime.desc())
                .fetch();
    }

    @Override
    public List<AccountTransactionAssetRes> findAccountTransactionByAccountId(long accountId) {
        QAccountTransaction accountTransaction = QAccountTransaction.accountTransaction;

        return queryFactory
                .select(Projections.constructor(AccountTransactionAssetRes.class,
                        accountTransaction.accountTransactionId,
                        accountTransaction.transactionSummary,
                        accountTransaction.transactionDate,
                        accountTransaction.transactionTime,
                        accountTransaction.transactionTypeName,
                        accountTransaction.transactionMemo,
                        accountTransaction.transactionBalance,
                        accountTransaction.transactionAfterBalance))
                .from(accountTransaction)
                .where(accountTransaction.account.accountId.eq(accountId))
                .orderBy(accountTransaction.transactionDate.desc(), accountTransaction.transactionTime.desc())
                .fetch();
    }
}