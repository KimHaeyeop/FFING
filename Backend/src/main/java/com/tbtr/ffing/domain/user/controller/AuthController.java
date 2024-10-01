package com.tbtr.ffing.domain.user.controller;

import com.tbtr.ffing.domain.finance.dto.response.expense.ExpenseRes;
import com.tbtr.ffing.domain.user.dto.UserInfoDTO;
import com.tbtr.ffing.domain.user.dto.UserSigninDTO;
import com.tbtr.ffing.domain.user.service.AuthService;
import com.tbtr.ffing.global.common.dto.Response;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.entity.ErrorResponseEntity;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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
    public ResponseEntity<?> signup(@Valid @RequestBody UserInfoDTO.Request requestDTO) {
        UserInfoDTO.Response signupResponse = authService.signup(requestDTO);
        return ResponseEntity.ok(Response.builder()
                                         .code(200L)
                                         .message("회원가입에 성공하였습니다.")
                                         .result(signupResponse).build());
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@Valid @RequestBody UserSigninDTO.Request requestDTO) {
        // 1. 로그인 처리 및 토큰과 응답 데이터 가져오기
        Map<String, Object> result = authService.signin(requestDTO);

        // 2. JWT 토큰 추출
        String accessToken = (String) result.get("accessToken");
        String refreshToken = (String) result.get("refreshToken");
        UserSigninDTO.Response userResponse = (UserSigninDTO.Response) result.get("response");

        // 3. JWT accessToken을 Authorization 헤더에 추가
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        // 4. 쿠키 생성 및 설정 (refreshToken을 쿠키에 추가)
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                                                          .httpOnly(true)
                                                          .path("/")
                                                          .maxAge(7 * 24 * 60 * 60)  // 7일
                                                          .secure(true)
                                                          .build();
        headers.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        // 5. 응답 메시지 생성 (성공 여부, 메시지, 결과 포함)
        Response<Object> responseBody = Response.builder()
                                                .code(200L)
                                                .message("로그인에 성공하였습니다.")
                                                .result(userResponse) // 로그인 응답 데이터
                                                .build();

        // 7. ResponseEntity에 응답 본문과 헤더를 함께 담아서 반환
        return new ResponseEntity<>(responseBody, headers, HttpStatus.OK);
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
