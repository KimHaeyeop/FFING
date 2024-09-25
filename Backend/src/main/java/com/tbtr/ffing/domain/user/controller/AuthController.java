package com.tbtr.ffing.domain.user.controller;

import com.tbtr.ffing.domain.user.dto.UserInfoDto;
import com.tbtr.ffing.domain.user.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
        System.out.println("nickname: " + requestDTO.getNickname());
        authService.signup(requestDTO);
        return ResponseEntity.ok("회원가입 성공");
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        System.out.println("test controller 진입");
        return ResponseEntity.ok("test ok");
    }
}
