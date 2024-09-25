package com.tbtr.ffing.domain.user.dto;

import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.entity.User.Gender;
import com.tbtr.ffing.domain.user.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class UserInfoDto {

    /**
     * 회원 가입 요청 DTO
     */
    @Data
    @Builder
    public static class Request {

        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "올바른 이메일 형식이어야 합니다.")
        private String email;

        @NotBlank(message = "비밀번호를 입력해주세요.")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
                message = "비밀번호는 8자에서 20자 사이여야 합니다."
        )
        private String password;

        @NotBlank(message = "사용자 이름을 입력해주세요.")
        @Size(max = 20, message = "사용자 이름은 최대 20자 이내여야 합니다.")
        private String username;

        @NotBlank(message = "성별을 입력해주세요.")
        private Gender gender;

        @NotBlank(message = "생년월일을 입력해주세요.")
        @Past(message = "생년월일은 과거 날짜여야 합니다.")
        private LocalDate birth;

        @NotBlank(message = "닉네임을 입력해주세요.")
        @Size(max = 20, message = "닉네임은 최대 20자 이내여야 합니다.")
        private String nickname;

        @Pattern(regexp = "^\\d{6}$", message = "PIN은 6자리 숫자여야 합니다.")
        private Integer pin;

        public static User toEntity(UserInfoDto.Request request, BCryptPasswordEncoder encoder) {
            return User.builder()
                       .email(request.getEmail())
                       .password(encoder.encode(request.getPassword()))
                       .username(request.getUsername())
                       .role(UserRole.ADMIN)
                       .gender(request.getGender())
                       .birth(request.getBirth())
                       .nickname(request.getNickname())
                       .pin(request.getPin())
                       .build();
        }
    }
}