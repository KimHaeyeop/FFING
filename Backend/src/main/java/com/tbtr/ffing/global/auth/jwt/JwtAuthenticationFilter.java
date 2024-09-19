package com.tbtr.ffing.global.auth.jwt;

import com.tbtr.ffing.global.util.CookieUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final TokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Cookie[] cookies = request.getCookies();
        String token = CookieUtil.getCookie(request, "token").orElseThrow().getValue();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        log.info(token);
        if (token == null || !tokenProvider.validToken(token)) {
            throw new RuntimeException("Invalid token");
        }
        Authentication authentication = tokenProvider.getAuthentication(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    /**
     * 회원가입과 로그인, 토큰재발급, swagger 문서에 대해서는 filtering 하지 않는다.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // 1번 조건: "test-token" equals the value of "X-Test-Token" header
        if ("test-token".equals(request.getHeader("X-Test-Token"))) {
            return true; // 필터링 하지 않음
        }

        // 2번 조건: 요청이 PATCH 메서드이고 경로가 /api/v1/sessions로 시작
        if (request.getMethod().equals("PATCH") && path.startsWith("/api/v1/sessions")) {
            return false; // 필터링 함
        }

        // 3번 조건: 쿠키에 token이 있는 경우
        if (CookieUtil.getCookie(request, "token").isPresent()) {
            return false; // 필터링 함
        }

        // 기본적으로 필터링 하지 않음
        return true;
    }
}
