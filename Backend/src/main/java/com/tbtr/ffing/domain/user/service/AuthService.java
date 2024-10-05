package com.tbtr.ffing.domain.user.service;

import com.tbtr.ffing.domain.user.dto.request.UserInfoReq;
import com.tbtr.ffing.domain.user.dto.request.UserSigninReq;
import com.tbtr.ffing.domain.user.dto.response.SigninRes;
import com.tbtr.ffing.domain.user.dto.response.UserInfoRes;

public interface AuthService {

    UserInfoRes signup(UserInfoReq userInfoReq);

    SigninRes signin(UserSigninReq userSigninReq);

    Boolean isNicknameDuplication(String nickname);
}
