package com.tbtr.ffing.domain.user.dto;

import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.entity.User.Gender;
import com.tbtr.ffing.domain.user.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class UserInfoDto {

    /**
     * 회원 가입 요청 DTO
     */
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Request {

        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "올바른 이메일 형식이어야 합니다.")
        private String email;

        @NotBlank(message = "비밀번호를 입력해주세요.")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,15}$",
                message = "비밀번호는 8자에서 15자 사이여야 합니다."
        )
        private String password;

        @NotBlank(message = "사용자 이름을 입력해주세요.")
        @Size(max = 20, message = "사용자 이름은 최대 20자 이내여야 합니다.")
        private String username;

        @NotBlank(message = "성별을 입력해주세요.")
        private String gender;

        @NotBlank(message = "생년월일을 입력해주세요.")
        @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "생년월일은 YYYY-MM-DD 형식이어야 합니다.")
        private String birth;

        @NotBlank(message = "닉네임을 입력해주세요.")
        @Size(max = 20, message = "닉네임은 최대 20자 이내여야 합니다.")
        private String nickname;

        @NotNull(message = "PIN을 입력해주세요.")
        @Size(min = 6, max = 6, message = "PIN은 6자리 숫자여야 합니다.")
        private String pin;

        public static User toEntity(UserInfoDto.Request request, BCryptPasswordEncoder encoder) {
            return User.builder()
                       .email(request.getEmail())
                       .password(encoder.encode(request.getPassword()))
                       .username(request.getUsername())
                       .role(UserRole.USER)
                       .gender(request.getGender().equals("M") ? Gender.M : Gender.F)
                       .birth(LocalDate.parse(request.getBirth()))
                       .nickname(request.getNickname())
                       .pin(Integer.parseInt(request.getPin()))
                       .ssafyUserId(1L)
                       .build();
        }
    }

    /**
     * 회원 가입, 사용자 정보 응답 DTO
     */
    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Response {

        private Long userId;

        private String email;

        private String username;

        private String role;

        private String gender;

        private String birth;

        private String nickname;

        private Long ssafyUserId;

        public static UserInfoDto.Response of(User user) {
            return Response.builder()
                           .userId(user.getUserId())
                           .email(user.getEmail())
                           .username(user.getUsername())
                           .role(user.getRole().toString())
                           .gender(user.getGender().toString())
                           .birth(user.getBirth().toString())
                           .nickname(user.getNickname())
                           .ssafyUserId(user.getSsafyUserId())
                           .build();
        }
    }
}