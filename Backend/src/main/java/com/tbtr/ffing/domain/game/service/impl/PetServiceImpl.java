package com.tbtr.ffing.domain.game.service.impl;

import com.tbtr.ffing.domain.game.dto.response.CurrentPetInfoRes;
import com.tbtr.ffing.domain.game.repository.PetRepository;
import com.tbtr.ffing.domain.game.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;

    @Override
    public CurrentPetInfoRes getCurrentPetInfo(long userId) {
        List<CurrentPetInfoRes> currentPPetInfoList = petRepository.findCurrentPetInfoByUserId(userId);
        currentPPetInfoList.get(0).setVarTotalStat(currentPPetInfoList.get(0).getTotalStat() - currentPPetInfoList.get(1).getTotalStat());
        currentPPetInfoList.get(0).setVarFinanceStat(currentPPetInfoList.get(0).getFinanceStat() - currentPPetInfoList.get(1).getFinanceStat());
        currentPPetInfoList.get(0).setVarFoodBakeryStat(currentPPetInfoList.get(0).getFoodBakeryStat() - currentPPetInfoList.get(1).getFoodBakeryStat());
        currentPPetInfoList.get(0).setVarLifeCultureStat(currentPPetInfoList.get(0).getLifeCultureStat() - currentPPetInfoList.get(1).getLifeCultureStat());
        currentPPetInfoList.get(0).setVarShoppingStat(currentPPetInfoList.get(0).getShoppingStat() - currentPPetInfoList.get(1).getShoppingStat());
        currentPPetInfoList.get(0).setVarTransportationStat(currentPPetInfoList.get(0).getTransportationStat() - currentPPetInfoList.get(1).getTransportationStat());
        return currentPPetInfoList.get(0);
    }
}
