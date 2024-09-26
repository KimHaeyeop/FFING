package com.tbtr.ffing.domain.user.service;

import com.tbtr.ffing.domain.user.dto.UserInfoDTO;

public interface AuthService {

    UserInfoDTO.Response signup(UserInfoDTO.Request requestDTO);

}
