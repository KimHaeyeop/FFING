package com.tbtr.ffing.domain.user.controller;

import com.tbtr.ffing.domain.user.dto.UserInfoDTO;
import com.tbtr.ffing.global.common.dto.Response;
import com.tbtr.ffing.domain.user.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserInfoDTO.Request requestDTO) {

        try {
            UserInfoDTO.Response signupResponse = authService.signup(requestDTO);
            Response<Object> response = Response.builder()
                                                .isSuccess(true)
                                                .code(200L)
                                                .message("회원가입에 성공하였습니다.")
                                                .result(signupResponse).build();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Response<Object> errorResponse = Response.builder()
                                                     .isSuccess(false)
                                                     .code(409L)
                                                     .message(e.getMessage())
                                                     .result(null).build();

            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        System.out.println("test controller 진입");
        return ResponseEntity.ok("test ok");
    }
}
