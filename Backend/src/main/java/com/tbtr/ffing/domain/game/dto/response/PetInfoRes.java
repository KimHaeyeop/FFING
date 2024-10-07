package com.tbtr.ffing.domain.game.dto.response;

import lombok.*;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class PetInfoRes {

    private Long petInfoId;
    private int totalStat;
    private int financeStat;
    private int foodBakeryStat;
    private int lifeCultureStat;
    private int shoppingStat;
    private int transportationStat;
    private int winCount;
    private int loseCount;
    private String petCode;
    private String petName;
    private String typeCode;
    private String typeName;
//    private int varTotalStat;
//    private int varFinanceStat;
//    private int varFoodBakeryStat;
//    private int varLifeCultureStat;
//    private int varShoppingStat;
//    private int varTransportationStat;
//
//    public CurrentPetInfoRes(Long petInfoId, int totalStat, int financeStat, int foodBakeryStat, int lifeCultureStat, int shoppingStat,int transportationStat, int winCount, int loseCount, String petCode, String petName, String typeCode, String typeName) {
//
//        this.petInfoId = petInfoId;
//        this.totalStat = totalStat;
//        this.financeStat = financeStat;
//        this.foodBakeryStat = foodBakeryStat;
//        this.lifeCultureStat = lifeCultureStat;
//        this.shoppingStat = shoppingStat;
//        this.transportationStat = transportationStat;
//        this.winCount = winCount;
//        this.loseCount = loseCount;
//        this.petCode = petCode;
//        this.petName = petName;
//        this.typeCode = typeCode;
//        this.typeName = typeName;
//
//    }

}
