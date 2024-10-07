package com.tbtr.ffing.domain.game.service;

import com.tbtr.ffing.domain.game.dto.response.CurrentPetInfoRes;

public interface PetService {
    CurrentPetInfoRes getCurrentPetInfo(long userId);
}
