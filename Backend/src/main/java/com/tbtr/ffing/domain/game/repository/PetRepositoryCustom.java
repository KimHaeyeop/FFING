package com.tbtr.ffing.domain.game.repository;

import com.tbtr.ffing.domain.game.dto.response.CurrentPetInfoRes;

import java.util.List;

public interface PetRepositoryCustom {

    List<CurrentPetInfoRes> findCurrentPetInfoByUserId(long userId);
}
