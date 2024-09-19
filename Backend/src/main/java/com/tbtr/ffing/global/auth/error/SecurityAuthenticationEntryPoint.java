package com.tbtr.ffing.global.auth.error;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tbtr.ffing.global.error.dto.ErrorResponse;
import com.tbtr.ffing.global.error.exception.SecurityAuthenticationException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class SecurityAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        ObjectMapper objectMapper = new ObjectMapper();
        log.error("인증에 실패했습니다.");
        SecurityAuthenticationException e = new SecurityAuthenticationException("인증에 실패했습니다.");
        response.setStatus(e.getErrorCode().getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter()
                .write(objectMapper.writeValueAsString(
                        ErrorResponse.builder()
                                .code(e.getErrorCode().name())
                                .message(e.getMessage())
                                .build()
                ));
    }
}
