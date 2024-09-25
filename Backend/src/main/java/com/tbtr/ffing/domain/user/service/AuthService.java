package com.tbtr.ffing.domain.user.service;

import com.tbtr.ffing.domain.user.dto.UserInfoDto.Request;

public interface AuthService {

    void signup(Request requestDTO);

}
