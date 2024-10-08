package com.tbtr.ffing.domain.game.service.impl;

import com.tbtr.ffing.domain.game.dto.response.PetCollectionRes;
import com.tbtr.ffing.domain.game.dto.response.PetHistoryRes;
import com.tbtr.ffing.domain.game.dto.response.PetInfoRes;
import com.tbtr.ffing.domain.game.entity.BattleHistory;
import com.tbtr.ffing.domain.game.entity.PetInfo;
import com.tbtr.ffing.domain.game.repository.BattleHistoryRepository;
import com.tbtr.ffing.domain.game.repository.PetRepository;
import com.tbtr.ffing.domain.game.service.PetService;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {

    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final BattleHistoryRepository battleHistoryRepository;

    @Override
    public PetInfo getLatestPetInfo(Long userId) {
        User user = userRepository.findByUserId(userId);

        return petRepository.findFirstByUserOrderByPetInfoIdDesc(user)
                .orElseThrow(()-> new CustomException(ErrorCode.PET_NOT_FOUND));

    }

    // 이기면 1, 지면 0
    @Override
    public ArrayList<Integer> getRecentBattleScore(Long petId) {
        List<BattleHistory> battleHistories = battleHistoryRepository.getRecent5BattleHistoriesByPetId(petId);
        ArrayList<Integer> battleScores = new ArrayList<>();

        for (BattleHistory battleHistory : battleHistories) {
            if (battleHistory.getWinnerPetId().equals(petId)){
                battleScores.add(1);
            }
            else {
                battleScores.add(0);
            }
        }

        return battleScores;

    }

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
