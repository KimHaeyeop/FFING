package com.tbtr.ffing.domain.game.dto.internal;

import com.tbtr.ffing.domain.game.entity.PetInfo;
import lombok.*;

import java.util.ArrayList;

@Builder
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class BattlePetInfo {

    private Long petInfoId;
    private double hp;
    private int totalStat;
    private ArrayList<Integer> stats;       // financeStat, foodBakeryStat, lifeCultureStat, shoppingStat, transportationStat
//    private int financeStat;
//    private int foodBakeryStat;
//    private int lifeCultureStat;
//    private int shoppingStat;
//    private int transportationStat;
    private String typeCode;
    private String typeName;

    public static BattlePetInfo from (PetInfo petInfo) {
        ArrayList<Integer> stats = new ArrayList<>();
        stats.add(petInfo.getFinanceStat());
        stats.add(petInfo.getFoodBakeryStat());
        stats.add(petInfo.getLifeCultureStat());
        stats.add(petInfo.getShoppingStat());
        stats.add(petInfo.getTransportationStat());

        return new BattlePetInfo(
            petInfo.getPetInfoId(),
            100,
            petInfo.getTotalStat(),
            stats,
//            petInfo.getFinanceStat(),
//            petInfo.getFoodBakeryStat(),
//            petInfo.getLifeCultureStat(),
//            petInfo.getShoppingStat(),
//            petInfo.getShoppingStat(),
            petInfo.getPetType().getTypeCode(),
            petInfo.getPetType().getTypeName()
        );
    }
}
