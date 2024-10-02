package com.tbtr.ffing.domain.user.dto;

import com.tbtr.ffing.domain.user.entity.User;
import lombok.Builder;
import lombok.Data;

public class UserSigninDTO {

    @Data
    public static class Request {
        private String email;
        private String password;
    }

    @Data
    @Builder
    public static class Response {
        private String email;
        private String username;
        private String nickname;

        public static Response of(User user) {
            return UserSigninDTO.Response.builder()
                                         .email(user.getEmail())
                                         .username(user.getUsername())
                                         .nickname(user.getNickname())
                                         .build();
        }
    }
}
