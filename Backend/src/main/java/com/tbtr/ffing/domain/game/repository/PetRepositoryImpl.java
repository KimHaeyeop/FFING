package com.tbtr.ffing.domain.game.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tbtr.ffing.domain.game.dto.response.PetCollectionRes;
import com.tbtr.ffing.domain.game.dto.response.PetHistoryRes;
import com.tbtr.ffing.domain.game.dto.response.PetInfoRes;
import com.tbtr.ffing.domain.game.entity.*;
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
    public List<PetInfoRes> findHomePetInfoByUserId(long userId) {
        QPetInfo petInfo = QPetInfo.petInfo;

        return queryFactory
                .select(Projections.constructor(PetInfoRes.class,
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

    @Override
    public List<PetHistoryRes> findPetHistoryByUserIdAndYearMonth(long userId, String yearMonth) {
        QPetInfo petInfo = QPetInfo.petInfo;

        return queryFactory
                .select(Projections.constructor(PetHistoryRes.class,
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
                        petInfo.petType.typeName,
                        petInfo.createdDate.substring(0, 6),
                        petInfo.createdDate.substring(6, 8).castToNum(Integer.class).add(-1).divide(7).add(1)))
                .from(petInfo)
                .where(petInfo.user.userId.eq(userId), petInfo.createdDate.substring(0, 6).eq(yearMonth))
                .orderBy(petInfo.createdDate.asc())
                .fetch();
    }

    @Override
    public List<PetCollectionRes> findPetCollectionByUserId(long userId) {
        QPetCollection petCollection = QPetCollection.petCollection;

        return queryFactory
                .select(Projections.constructor(PetCollectionRes.class,
                        petCollection.petCollectionId,
                        petCollection.petList.petCode,
                        petCollection.petList.petName,
                        petCollection.createdDate))
                .from(petCollection)
                .where(petCollection.user.userId.eq(userId))
                .orderBy(petCollection.petList.petCode.asc())
                .fetch();
    }

    @Override
    public PetList findPetByPetId(long petId) {
        QPetList petList = QPetList.petList;

        return queryFactory
                .selectFrom(petList)
                .where(petList.petId.eq(petId))
                .fetchOne();
    }

    @Override
    public PetType findPetTypeByTypeId(long typeId) {
        QPetType petType = QPetType.petType;

        return queryFactory
                .selectFrom(petType)
                .where(petType.typeId.eq(typeId))
                .fetchOne();
    }

}
