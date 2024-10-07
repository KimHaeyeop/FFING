package com.tbtr.ffing.global.auth.handler;

import com.tbtr.ffing.global.auth.util.SecurityErrorResponseUtil;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.exceptionType.CustomJWTException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

@Log4j2
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        log.error("---------accessDeniedHandler---------");
        CustomJWTException e = new CustomJWTException(ErrorCode.ACCESS_DENIED_ERROR);
        SecurityErrorResponseUtil.setSecurityErrorResponse(e, response);
    }
}
