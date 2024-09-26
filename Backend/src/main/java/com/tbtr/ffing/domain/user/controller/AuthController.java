package com.tbtr.ffing.domain.user.controller;

import com.tbtr.ffing.domain.user.dto.UserInfoDto;
import com.tbtr.ffing.global.common.dto.Response;
import com.tbtr.ffing.domain.user.service.AuthService;
import com.tbtr.ffing.global.error.exception.CustomException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserInfoDto.Request requestDTO) {

        UserInfoDto.Response signupResponse = authService.signup(requestDTO);
        Response<Object> response = Response.builder()
                                            .code(200L)
                                            .message("회원가입에 성공하였습니다.")
                                            .result(signupResponse).build();
        return ResponseEntity.ok(response);

    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        System.out.println("test controller 진입");
        return ResponseEntity.ok("test ok");
    }
}
