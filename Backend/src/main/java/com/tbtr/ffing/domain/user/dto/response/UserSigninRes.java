package com.tbtr.ffing.domain.user.dto.response;

import com.tbtr.ffing.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 로그인 응답 DTO
 */
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class UserSigninRes {

    private String email;
    private String username;
    private String nickname;

    public static UserSigninRes of(User user) {
        return UserSigninRes.builder()
                            .email(user.getEmail())
                            .username(user.getUsername())
                            .nickname(user.getNickname()).build();
    }
}
