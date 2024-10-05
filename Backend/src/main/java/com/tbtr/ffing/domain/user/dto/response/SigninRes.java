package com.tbtr.ffing.domain.user.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpHeaders;


/**
 * 로그인 controller - service 용 DTO
 */
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class SigninRes {

    HttpHeaders httpHeaders;
    UserSigninRes userSigninRes;

    public static SigninRes of(HttpHeaders httpHeaders, UserSigninRes userSigninRes) {
        return SigninRes.builder()
                        .httpHeaders(httpHeaders)
                        .userSigninRes(userSigninRes).build();
    }
}
