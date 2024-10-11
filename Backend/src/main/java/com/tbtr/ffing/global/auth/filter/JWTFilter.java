package com.tbtr.ffing.global.auth.filter;

import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.auth.util.JWTUtil;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.CustomException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

@RequiredArgsConstructor
@Log4j2
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String[] excludePath = {"/api/v1/auth"};
        String path = request.getRequestURI();
//        return Arrays.stream(excludePath).anyMatch(path::startsWith);
        return true; // 테스트를 위해 모두 true로 열어둠(임시)
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        log.info("-------jwt filter-------");

        // 1. 헤더에서 Access Token 추출
        String accessToken = extractToken(request);
        if (accessToken == null || accessToken.isEmpty()) {
            log.info("accessToken is null or empty");
            sendErrorResponse(response, "Access token is missing", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }


        // 2. Access Token 만료 여부 확인
        if (jwtUtil.isExpired(accessToken)) {
            log.info("Access token expired: {}", accessToken);
            // 만료된 Access Token에 대한 응답을 보내고 리턴
            sendErrorResponse(response, "Access token expired", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 3. 추출된 Access Token으로 사용자 인증 처리
        authenticateUser(accessToken);

        // 4. 필터 체인을 계속 실행하여 요청을 다음 단계로 전달
        filterChain.doFilter(request, response);
    }

    private void authenticateUser(String token) {
        log.info("[authenticateUser] {}", token);

        Long userId = jwtUtil.getUserId(token);
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        CustomUserDetails customUserDetails = CustomUserDetails.of(user);

        // userDetails 기반 인증 생성 및 securityContext 에 저장
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null,
                customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }

    private void sendErrorResponse(HttpServletResponse response, String message, int status) throws IOException {
        response.setStatus(status);
        response.getWriter().println(message);
    }

    private String extractToken(HttpServletRequest request) {
        String accessToken = request.getHeader("Authorization");
        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            return accessToken.substring(7);
        }
        return null;
    }
}