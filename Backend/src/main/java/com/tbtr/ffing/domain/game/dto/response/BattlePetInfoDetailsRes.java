package com.tbtr.ffing.domain.game.dto.response;

import com.tbtr.ffing.domain.game.entity.PetInfo;
import com.tbtr.ffing.domain.game.entity.PetList;
import com.tbtr.ffing.domain.game.entity.PetType;
import lombok.*;

import java.util.ArrayList;

@Builder
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class BattlePetInfoDetailsRes {

    private Long petInfoId;
    private String nickname;                // 사용자의 닉네임
    private ArrayList<Integer> recentScore;
    private int winCount;
    private int loseCount;
    private int totalStat;
    private ArrayList<Integer> stats;       // financeStat, foodBakeryStat, lifeCultureStat, shoppingStat, transportationStat
//    private int financeStat;
//    private int foodBakeryStat;
//    private int lifeCultureStat;
//    private int shoppingStat;
//    private int transportationStat;
    private String petCode;
    private String petType;

    public static BattlePetInfoDetailsRes from (PetInfo petInfo, String username, ArrayList<Integer> recentScore) {
        ArrayList<Integer> stats = new ArrayList<>();
        stats.add(petInfo.getFinanceStat());
        stats.add(petInfo.getFoodBakeryStat());
        stats.add(petInfo.getLifeCultureStat());
        stats.add(petInfo.getShoppingStat());
        stats.add(petInfo.getTransportationStat());

        return new BattlePetInfoDetailsRes(
                petInfo.getPetInfoId(),
                username,
                recentScore,
                petInfo.getWinCount(),
                petInfo.getLoseCount(),
                petInfo.getTotalStat(),
                stats,
//                petInfo.getFinanceStat(),
//                petInfo.getFoodBakeryStat(),
//                petInfo.getLifeCultureStat(),
//                petInfo.getShoppingStat(),
//                petInfo.getShoppingStat(),
                petInfo.getPetList().getPetCode(),
                petInfo.getPetType().getTypeCode()
        );
    }
}
