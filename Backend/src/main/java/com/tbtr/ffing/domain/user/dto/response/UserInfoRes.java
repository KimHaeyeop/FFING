package com.tbtr.ffing.domain.user.dto.response;

import com.tbtr.ffing.domain.user.entity.User;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원 가입, 사용자 정보 응답 DTO
 */
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class UserInfoRes {

    private Long userId;
    private String email;
    private String username;
    private String role;
    private String gender;
    private String birth;
    private String nickname;
    private Long ssafyUserId;

    public static UserInfoRes of(User user) {
        return UserInfoRes.builder()
                       .userId(user.getUserId())
                       .email(user.getEmail())
                       .username(user.getUsername())
                       .role(user.getRole().toString())
                       .gender(user.getGender().toString())
                       .birth(user.getBirth().toString())
                       .nickname(user.getNickname())
                       .ssafyUserId(user.getSsafyUserId()).build();
    }
}