package com.tbtr.ffing.domain.user.controller;

import com.tbtr.ffing.domain.user.dto.request.UserInfoReq;
import com.tbtr.ffing.domain.user.dto.request.UserSigninReq;
import com.tbtr.ffing.domain.user.dto.response.SigninRes;
import com.tbtr.ffing.domain.user.dto.response.UserInfoRes;
import com.tbtr.ffing.domain.user.service.AuthService;
import com.tbtr.ffing.global.common.dto.Response;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserInfoReq userInfoReq) {
        UserInfoRes signupResponse = authService.signup(userInfoReq);
        return ResponseEntity.ok(Response.builder()
                                         .code(200L)
                                         .message("회원가입에 성공하였습니다.")
                                         .result(signupResponse).build());
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@Valid @RequestBody UserSigninReq userSigninReq) {
        SigninRes signinRes = authService.signin(userSigninReq);

        Response<Object> response = Response.builder()
                                                .code(200L)
                                                .message("로그인에 성공하였습니다.")
                                                .result(signinRes.getUserSigninRes()) // 로그인 응답 데이터
                                                .build();

        return new ResponseEntity<>(response, signinRes.getHttpHeaders(), HttpStatus.OK);
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        Boolean isNicknameDuplication = authService.isNicknameDuplication(nickname);
        if (!isNicknameDuplication) {
            return new ResponseEntity<>(nickname + " 은(는) 사용가능한 닉네임입니다.", HttpStatus.OK);
        }
        return new ResponseEntity<>(nickname + " 은(는) 중복된 닉네임입니다.", HttpStatus.BAD_REQUEST);
    }
}
