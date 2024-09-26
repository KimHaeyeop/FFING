package com.tbtr.ffing.domain.user.dto;

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
    }
}
