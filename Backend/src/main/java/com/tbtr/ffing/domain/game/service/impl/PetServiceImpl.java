package com.tbtr.ffing.domain.game.service.impl;

import com.tbtr.ffing.domain.game.dto.response.PetCollectionRes;
import com.tbtr.ffing.domain.game.dto.response.PetHistoryRes;
import com.tbtr.ffing.domain.game.dto.response.PetInfoRes;
import com.tbtr.ffing.domain.game.repository.PetRepository;
import com.tbtr.ffing.domain.game.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;

    @Override
    public Map<String, PetInfoRes> getHomePetInfo(long userId) {
        Map<String, PetInfoRes> resultMap = new HashMap<String, PetInfoRes>();
        List<PetInfoRes> homePetInfo = petRepository.findHomePetInfoByUserId(userId);
        resultMap.put("currentPetInfo", homePetInfo.get(0));
        resultMap.put("beforePetInfo", homePetInfo.get(1));
//        currentPPetInfoList.get(0).setVarTotalStat(currentPPetInfoList.get(0).getTotalStat() - currentPPetInfoList.get(1).getTotalStat());
//        currentPPetInfoList.get(0).setVarFinanceStat(currentPPetInfoList.get(0).getFinanceStat() - currentPPetInfoList.get(1).getFinanceStat());
//        currentPPetInfoList.get(0).setVarFoodBakeryStat(currentPPetInfoList.get(0).getFoodBakeryStat() - currentPPetInfoList.get(1).getFoodBakeryStat());
//        currentPPetInfoList.get(0).setVarLifeCultureStat(currentPPetInfoList.get(0).getLifeCultureStat() - currentPPetInfoList.get(1).getLifeCultureStat());
//        currentPPetInfoList.get(0).setVarShoppingStat(currentPPetInfoList.get(0).getShoppingStat() - currentPPetInfoList.get(1).getShoppingStat());
//        currentPPetInfoList.get(0).setVarTransportationStat(currentPPetInfoList.get(0).getTransportationStat() - currentPPetInfoList.get(1).getTransportationStat());
        return resultMap;
    }

    @Override
    public List<PetHistoryRes> getPetHistory(long userId, String yearMonth) {
        return petRepository.findPetHistoryByUserIdAndYearMonth(userId, yearMonth);
    }

    @Override
    public List<PetCollectionRes> getPetCollection(long userId) {
        return petRepository.findPetCollectionByUserId(userId);
    }
}
