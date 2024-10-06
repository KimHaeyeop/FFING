package com.tbtr.ffing.global.auth;

import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.auth.util.JWTUtil;
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
        return Arrays.stream(excludePath).anyMatch(path::startsWith);
//        return true; // 테스트를 위해 모두 true로 열어둠(임시)
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        log.info("-------jwt filter-------");

        // 1. 헤더에서 Access Token 추출
        String accessToken = extractToken(request);
        if (accessToken == null || accessToken.isEmpty()) {
            sendErrorResponse(response, "Access token is missing", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 2. Access Token 만료 여부 확인
        if (jwtUtil.isExpired(accessToken)) {
            log.info("Access token expired: " + accessToken);
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
        log.info("[authenticateUser] " + token);

        Long userId = jwtUtil.getUserId(token);
        User user = userRepository.findByUserId(userId);

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








//package com.tbtr.ffing.global.auth;
//
//import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
//import com.tbtr.ffing.domain.user.entity.User;
//import com.tbtr.ffing.domain.user.repository.UserRepository;
//import com.tbtr.ffing.global.auth.util.JWTUtil;
//import com.tbtr.ffing.global.redis.component.RedisRefreshToken;
//import com.tbtr.ffing.global.redis.repository.RedisRefreshTokenRepository;
//import com.tbtr.ffing.global.redis.service.RedisRefreshTokenService;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.Cookie;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import java.io.IOException;
//import java.util.Optional;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//
//@RequiredArgsConstructor
//@Log4j2
//public class JWTFilter extends OncePerRequestFilter {
//
//    private final JWTUtil jwtUtil;
//    private final UserRepository userRepository;
//    private final RedisRefreshTokenRepository redisRefreshTokenRepository;
//    private final RedisRefreshTokenService redisRefreshTokenService;
//
//    /*
//     * * 토큰 검증없이 접근 가능한 api를 설정함
//     * */
//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) {
//        String[] excludePath = {"/api/v1/auth/signin", "/api/v1/auth/signup"};
//
//        String path = request.getRequestURI();
////        return Arrays.stream(excludePath).anyMatch(path::startsWith);
//        return true; // 테스트를 위해 모두 true로 열어둠(임시)
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//            throws ServletException, IOException {
//        log.info("-------jwt filter-------");
//
//        // 1. 헤더에서 Access Token 추출
//        // Authorization 헤더에서 토큰을 추출하여 검증할 준비를 한다.
//        String accessToken = extractToken(request);
//        if (accessToken == null || accessToken.isEmpty()) {
//            sendErrorResponse(response, "Access token is missing", HttpServletResponse.SC_UNAUTHORIZED);
//            return;
//        }
//
//        // 2. Access Token 만료 여부 확인
//        if (jwtUtil.isExpired(accessToken)) {
//            System.out.println("access token expired: " + accessToken);
//            // 만료된 Access Token을 처리
//            handleExpiredToken(request, response, accessToken, filterChain);
//            // 새로 발급된 Access Token을 Authorization 헤더에서 가져온다.
//            String authorizationHeader = response.getHeader("Authorization");
//
//            // Authorization 헤더가 비어있는지 또는 Bearer 토큰 형식이 올바른지 체크
//            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//                // 헤더가 없거나 형식이 잘못되었을 경우 에러 응답을 보낸다.
//                sendErrorResponse(response, "Invalid authorization header", HttpServletResponse.SC_UNAUTHORIZED);
//                return;
//            }
//
//            // 새로 발급된 Access Token을 사용하기 위해 Bearer 부분을 제거한 토큰을 추출
//            accessToken = authorizationHeader.substring(7);
//        }
//
//        // 3. 추출된 Access Token으로 사용자 인증 처리
//        authenticateUser(accessToken);
//
//        // 4. 필터 체인을 계속 실행하여 요청을 다음 단계로 전달
//        filterChain.doFilter(request, response);
//    }
//
//    private void handleExpiredToken(HttpServletRequest request, HttpServletResponse response, String accessToken,
//                                    FilterChain filterChain)
//            throws IOException, ServletException {
//        log.info("Handling expired token: " + accessToken);
//
//        Optional<RedisRefreshToken> redisRefreshToken = redisRefreshTokenRepository.findByAccessToken(accessToken);
//        if (redisRefreshToken.isEmpty()) {
//            sendErrorResponse(response, "[Redis] Refresh token is missing", HttpServletResponse.SC_UNAUTHORIZED);
//            return;
//        }
//
//        String refreshToken = extractRefreshToken(request);
//        if (refreshToken == null) {
//            sendErrorResponse(response, "[extract] Refresh token is missing", HttpServletResponse.SC_UNAUTHORIZED);
//            return;
//        }
//
//        Long storedUserId = Long.parseLong(redisRefreshToken.get().getId());
//        Long tokenUserId = Long.parseLong(jwtUtil.getUserId(accessToken));
//
//        if (!storedUserId.equals(tokenUserId)) {
//            sendErrorResponse(response, "Invalid access token", HttpServletResponse.SC_UNAUTHORIZED);
//            return;
//        }
//
//        // Refresh Token 만료 체크
//        if (jwtUtil.isExpired(refreshToken)) {
//            redisRefreshTokenService.deleteRedisDataById(storedUserId);  // Redis 에서 기존 토큰 삭제
//            sendErrorResponse(response, "Refresh token expired, please log in again",
//                    HttpServletResponse.SC_UNAUTHORIZED);
//            return;
//        }
//
//        // 기존 Access/Refresh Token 삭제
//        redisRefreshTokenService.deleteRedisDataById(storedUserId);
//
//        User user = userRepository.findById(tokenUserId).orElseThrow(() -> new RuntimeException("User not found"));
//        CustomUserDetails customUserDetails = CustomUserDetails.of(user);
//        // Refresh Token 유효하면 새로운 Access/Refresh Token 발급
//        String newAccessToken = jwtUtil.createJwt("access", customUserDetails);
//        String newRefreshToken = jwtUtil.createJwt("refresh", customUserDetails);
//        redisRefreshTokenService.saveRedisData(storedUserId, newAccessToken, newRefreshToken);
//
//        log.info("new access token: " + newAccessToken);
//        log.info("new refresh token: " + newRefreshToken);
//
//        // 쿠키와 헤더 업데이트
//        updateCookiesAndHeader(response, newAccessToken, newRefreshToken);
//
//        authenticateUser(newAccessToken);
//
//        filterChain.doFilter(request, response);
//
//    }
//
//    private void updateCookiesAndHeader(HttpServletResponse response, String newAccessToken, String newRefreshToken) {
//        // Authorization 헤더에 새 Access Token 설정
//        response.setHeader("Authorization", "Bearer " + newAccessToken);
//
//        // 쿠키에 새 Refresh Token 설정
//        Cookie refreshTokenCookie = new Cookie("refreshToken", newRefreshToken);
//        refreshTokenCookie.setHttpOnly(true);
//        refreshTokenCookie.setPath("/");
//        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 7);  // 7일
//        response.addCookie(refreshTokenCookie);
//    }
//
//    // Refresh Token을 쿠키에서 추출하는 메소드 (예시)
//    private String extractRefreshToken(HttpServletRequest request) {
//        Cookie[] cookies = request.getCookies();
//        if (cookies != null) {
//            for (Cookie cookie : cookies) {
//                if ("refreshToken".equals(cookie.getName())) {
//                    return cookie.getValue();
//                }
//            }
//        }
//        return null;
//    }
//
//    private void authenticateUser(String token) {
//        log.info("[authenticateUser] " + token);
//
//        Long userId = Long.parseLong(jwtUtil.getUserId(token));
//        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
//
//        CustomUserDetails customUserDetails = CustomUserDetails.of(user);
//
//        // userDetails 기반 인증 생성 및 securityContext 에 저장
//        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null,
//                customUserDetails.getAuthorities());
//        SecurityContextHolder.getContext().setAuthentication(authToken);
//    }
//
//
//    private String getUserRole(Long userId) {
//        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
//        return user.getRole().toString();
//    }
//
//
//    private void sendErrorResponse(HttpServletResponse response, String message, int status) throws IOException {
//        response.setStatus(status);
//        response.getWriter().println(message);
//    }
//
//    private String extractToken(HttpServletRequest request) {
//        String accessToken = request.getHeader("Authorization");
//        if (accessToken != null && accessToken.startsWith("Bearer ")) {
//            return accessToken.substring(7);
//        }
//        return null;
//    }
//
//}
