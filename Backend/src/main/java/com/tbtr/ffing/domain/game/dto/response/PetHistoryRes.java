package com.tbtr.ffing.domain.game.dto.response;

import lombok.*;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class PetHistoryRes {

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
    private String yearMonth;
    private int week;

//    public PetHistoryRes(Long petInfoId, int totalStat, int financeStat, int lifeCultureStat, int foodBakeryStat, int shoppingStat, int transportationStat, int winCount, int loseCount, String petCode, String petName, String typeCode, String typeName, String yearMonth) {
//        this.petInfoId = petInfoId;
//        this.totalStat = totalStat;
//        this.financeStat = financeStat;
//        this.lifeCultureStat = lifeCultureStat;
//        this.foodBakeryStat = foodBakeryStat;
//        this.shoppingStat = shoppingStat;
//        this.transportationStat = transportationStat;
//        this.winCount = winCount;
//        this.loseCount = loseCount;
//        this.petCode = petCode;
//        this.petName = petName;
//        this.typeCode = typeCode;
//        this.typeName = typeName;
//        this.yearMonth = yearMonth;
//    }

}
