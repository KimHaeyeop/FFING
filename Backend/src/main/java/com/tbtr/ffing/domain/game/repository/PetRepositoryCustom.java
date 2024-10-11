package com.tbtr.ffing.domain.game.repository;

import com.tbtr.ffing.domain.game.dto.response.PetCollectionRes;
import com.tbtr.ffing.domain.game.dto.response.PetHistoryRes;
import com.tbtr.ffing.domain.game.dto.response.PetInfoRes;
import com.tbtr.ffing.domain.game.entity.PetList;
import com.tbtr.ffing.domain.game.entity.PetType;

import java.util.List;

public interface PetRepositoryCustom {
    List<PetInfoRes> findHomePetInfoByUserId(long userId);

    List<PetHistoryRes> findPetHistoryByUserIdAndYearMonth(long userId, String yearMonth);

    List<PetCollectionRes> findPetCollectionByUserId(long userId);

    PetList findPetByPetId(long petId);

    PetType findPetTypeByTypeId(long typeId);
}
