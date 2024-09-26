package com.tbtr.ffing.domain.finance.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.finance.entity.Asset;
import com.tbtr.ffing.domain.finance.entity.QAsset;

import java.util.List;

public class AssetRepositoryImpl implements AssetRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public AssetRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

//    @Override
//    public List<User> getUsers() {
//        return queryFactory
//                .selectFrom(user)
//                .fetch();
//    }

    @Override
    public Asset findCurrentAssetByUserId(long userId) {
        QAsset asset = QAsset.asset;

        return queryFactory
                .selectFrom(asset)
                .where(asset.user.userId.eq(userId))
                .orderBy(asset.updatedAt.desc())
                .limit(1)
                .fetchOne();
    }

    @Override
    public List<Asset> findAssetHistoryByUserId(long userId) {
        return List.of();
    }
}
