package com.tbtr.ffing.global.auth.filter;

import com.tbtr.ffing.global.auth.util.SecurityErrorResponseUtil;
import com.tbtr.ffing.global.error.exception.exceptionType.CustomJWTException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * JWT CheckFilter에서 발생한 예외 사항을 처리함
 */
public class JWTExceptionFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (CustomJWTException e) {
            SecurityErrorResponseUtil.setSecurityErrorResponse(e, response);
        }

    }
}
