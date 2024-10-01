package com.tbtr.ffing.domain.user.service;

import com.tbtr.ffing.domain.user.dto.UserInfoDTO;
import com.tbtr.ffing.domain.user.dto.UserSigninDTO;
import java.util.Map;

public interface AuthService {

    UserInfoDTO.Response signup(UserInfoDTO.Request requestDTO);

    Map<String, Object> signin(UserSigninDTO.Request requestDTO);

    Boolean isNicknameDuplication(String nickname);
}
