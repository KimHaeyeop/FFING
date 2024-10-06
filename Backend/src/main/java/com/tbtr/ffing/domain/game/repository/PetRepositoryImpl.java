package com.tbtr.ffing.domain.game.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.game.dto.response.CurrentPetInfoRes;
import com.tbtr.ffing.domain.game.entity.QPetInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PetRepositoryImpl implements PetRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final SecurityFilterChain defaultSecurityFilterChain;

    @Override
    public List<CurrentPetInfoRes> findCurrentPetInfoByUserId(long userId) {
        QPetInfo petInfo = QPetInfo.petInfo;

        return queryFactory
                .select(Projections.constructor(CurrentPetInfoRes.class,
                        petInfo.petInfoId,
                        petInfo.totalStat,
                        petInfo.financeStat,
                        petInfo.foodBakeryStat,
                        petInfo.lifeCultureStat,
                        petInfo.shoppingStat,
                        petInfo.transportationStat,
                        petInfo.winCount,
                        petInfo.loseCount,
                        petInfo.petList.petCode,
                        petInfo.petList.petName,
                        petInfo.petType.typeCode,
                        petInfo.petType.typeName))
                .from(petInfo)
                .where(petInfo.user.userId.eq(userId))
                .orderBy(petInfo.createdDate.desc())
                .limit(2)
                .fetch();
    }

//    @Override
//    public AssetRes findCurrentAssetByUserId(long userId) {
//        QAsset asset = QAsset.asset;
//
//        return queryFactory
//                .select(Projections.constructor(AssetRes.class,
//                        asset.assetId,
//                        asset.totalAsset,
//                        asset.accountBalance,
//                        asset.depositSavingsBalance,
//                        asset.stockBalance,
//                        asset.othersBalance,
//                        asset.updatedDate))
//                .from(asset)
//                .where(asset.user.userId.eq(userId))
//                .orderBy(asset.updatedDate.desc())
//                .limit(1)
//                .fetchOne();
//    }

}
