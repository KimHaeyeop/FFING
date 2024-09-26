package com.tbtr.ffing.domain.finance.repository;

import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringPath;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.finance.dto.response.asset.AssetRes;
import com.tbtr.ffing.domain.finance.dto.response.asset.DepositAssetRes;
import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.finance.entity.QAsset;
import com.tbtr.ffing.domain.finance.entity.QDepositAccount;
import com.tbtr.ffing.domain.finance.entity.QSavingsAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AssetRepositoryImpl implements AssetRepositoryCustom {

    private final JPAQueryFactory queryFactory;

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
                        asset.updatedAt))
                .from(asset)
                .where(asset.user.userId.eq(userId))
                .orderBy(asset.updatedAt.desc())
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
                        asset.updatedAt))
                .from(asset)
                .where(asset.user.userId.eq(userId))
                .orderBy(asset.updatedAt.desc())
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
    public List<DepositAssetRes> findSavingsAssetListByUserId(long ssafyUserId) {
        QSavingsAccount savingsAccount = QSavingsAccount.savingsAccount;

        return queryFactory
                .select(Projections.constructor(DepositAssetRes.class,
                        savingsAccount.savingsAccountId,
                        savingsAccount.bankCode,
                        savingsAccount.accountName,
                        savingsAccount.accountNo,
                        savingsAccount.totalBalance))
                .from(savingsAccount)
                .where(savingsAccount.ssafyUser.ssafyUserId.eq(ssafyUserId))
                .fetch();
    }
}
