package com.tbtr.ffing.global.auth.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.entity.ErrorResponseEntity;
import com.tbtr.ffing.global.error.exception.exceptionType.CustomJWTException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.ErrorResponse;

@Log4j2
public class SecurityErrorResponseUtil {
    /*
     * Security Filter에서 발생한 예외 사항을 ErrorResponse 형태로 변환함
     * */
    public static void setSecurityErrorResponse(CustomJWTException e, HttpServletResponse response, HttpServletRequest request)
            throws IOException {
        ErrorCode errorCode = e.getErrorCode();
        int status = errorCode.getHttpStatus().value();

        // ErrorResponseEntiy 객체 생성
        ErrorResponseEntity errorResponse = ErrorResponseEntity.builder()
                                                         .status(status)
                                                         .code(errorCode.getCode())
                                                         .message(errorCode.getMessage())
                                                         .build();
        // JSON으로 변환
        String jsonResponse = new ObjectMapper().writeValueAsString(errorResponse);

        // 응답에 Error Response 저장
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(jsonResponse);
    }
}
