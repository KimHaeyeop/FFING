package com.tbtr.ffing.domain.game.service;

import com.tbtr.ffing.domain.game.dto.response.PetCollectionRes;
import com.tbtr.ffing.domain.game.dto.response.PetHistoryRes;
import com.tbtr.ffing.domain.game.dto.response.PetInfoRes;

import java.util.List;
import java.util.Map;

public interface PetService {
    Map<String, PetInfoRes> getHomePetInfo(long userId);

    List<PetHistoryRes> getPetHistory(long userId, String yearMonth);

    List<PetCollectionRes> getPetCollection(long userId);
}
