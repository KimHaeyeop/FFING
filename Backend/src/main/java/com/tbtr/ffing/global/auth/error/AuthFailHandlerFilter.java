package com.tbtr.ffing.global.auth.error;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tbtr.ffing.global.error.dto.ErrorResponse;
import com.tbtr.ffing.global.error.exception.SecurityAuthenticationException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class AuthFailHandlerFilter extends OncePerRequestFilter {
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (SecurityAuthenticationException e) {
            response.setStatus(e.getErrorCode().getHttpStatus().value());
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter()
                    .write(objectMapper.writeValueAsString(
                            ErrorResponse.builder()
                                    .code(e.getErrorCode().name())
                                    .message(e.getMessage())
                                    .build()
                    ));
            log.error("Invalid token error");
        } catch (UsernameNotFoundException e ){
            response.setStatus(403);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter()
                    .write(objectMapper.writeValueAsString(
                            ErrorResponse.builder()
                                    .code("403")
                                    .message(e.getMessage())
                                    .build()
                    ));
            log.error("User Not Found Error");
        } catch (Exception e ){
            response.setStatus(500);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter()
                    .write(objectMapper.writeValueAsString(
                            ErrorResponse.builder()
                                    .code("500")
                                    .message(e.getMessage())
                                    .build()
                    ));
            log.error("Auth Error :: \n {}", e.getMessage());
        }
    }
}
