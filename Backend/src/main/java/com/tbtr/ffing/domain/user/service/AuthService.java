package com.tbtr.ffing.domain.user.service;

import com.tbtr.ffing.domain.user.dto.UserInfoDto;

public interface AuthService {

    UserInfoDto.Response signup(UserInfoDto.Request requestDTO);

}
