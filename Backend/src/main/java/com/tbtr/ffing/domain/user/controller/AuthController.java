package com.tbtr.ffing.domain.user.controller;

import com.tbtr.ffing.domain.user.dto.request.UserInfoReq;
import com.tbtr.ffing.domain.user.dto.request.UserSigninReq;
import com.tbtr.ffing.domain.user.dto.response.SigninRes;
import com.tbtr.ffing.domain.user.dto.response.UserInfoRes;
import com.tbtr.ffing.domain.user.service.AuthService;
import com.tbtr.ffing.global.common.dto.Response;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.CustomException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
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
@Log4j2
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserInfoReq userInfoReq) {
        UserInfoRes signupResponse = authService.signup(userInfoReq);
        return ResponseEntity.ok(Response.builder()
                                         .code(200L)
                                         .message("회원가입에 성공하였습니다.")
                                         .result(signupResponse).build());
    }

    /**
     * 로그인
     */
    @PostMapping("/signin")
    public ResponseEntity<?> signin(@Valid @RequestBody UserSigninReq userSigninReq) {
        SigninRes signinRes = authService.signin(userSigninReq);

        Response<Object> response = Response.builder()
                                            .code(200L)
                                            .message("로그인에 성공하였습니다.")
                                            .result(signinRes.getUserSigninRes()).build();

        return new ResponseEntity<>(response, signinRes.getHttpHeaders(), HttpStatus.OK);
    }

    /**
     * 이메일 중복 체크
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        Boolean isEmailDuplication = authService.isEmialDuplication(email);
        if (!isEmailDuplication) {
            return ResponseEntity.ok(Response.builder()
                                             .code(200L)
                                             .message(email + " 은(는) 사용 가능한 이메일입니다.").build());
        }
        throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
    }

    /**
     * 닉네임 중복 체크
     */
    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNickname(@RequestParam String nickname) {
        Boolean isNicknameDuplication = authService.isNicknameDuplication(nickname);
        if (!isNicknameDuplication) {
            return ResponseEntity.ok(Response.builder()
                                             .code(200L)
                                             .message(nickname + " 은(는) 사용 가능한 닉네임입니다.").build());
        }
        throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);
    }

    /**
     * access token 만료 시 refresh token 기반 재발급 요청
     */
    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        authService.reissue(request, response);
        return ResponseEntity.ok(Response.builder()
                                         .code(200L)
                                         .message("access token 재발급 성공").build());
    }
}
