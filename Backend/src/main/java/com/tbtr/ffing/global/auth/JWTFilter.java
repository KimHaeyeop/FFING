package com.tbtr.ffing.global.auth;

import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.redis.component.RedisRefreshToken;
import com.tbtr.ffing.global.redis.repository.RedisRefreshTokenRepository;
import com.tbtr.ffing.global.redis.service.RedisRefreshTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;
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
    private final RedisRefreshTokenRepository redisRefreshTokenRepository;
    private final RedisRefreshTokenService redisRefreshTokenService;

    /*
     * * 토큰 검증없이 접근 가능한 api를 설정함
     * */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String[] excludePath = {"/api/v1/auth/signin", "/api/v1/auth/signup"};

        String path = request.getRequestURI();
        return Arrays.stream(excludePath).anyMatch(path::startsWith);
//        return true; // 테스트를 위해 모두 true로 열어둠(임시)
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        log.info("-------jwt filter-------");

        String accessToken = extractToken(request);
        if (accessToken == null || accessToken.isEmpty()) {
            sendErrorResponse(response, "Access token is missing", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        if (jwtUtil.isExpired(accessToken)) {
            handleExpiredToken(request, response, accessToken);
            accessToken = response.getHeader("Authorization").substring(7);
        }

        authenticateUser(accessToken);
        filterChain.doFilter(request, response);
    }

    private void handleExpiredToken(HttpServletRequest request, HttpServletResponse response, String accessToken)
            throws IOException {
        System.out.println("Handling expired token: " + accessToken);

        // Redis에서 Access Token에 대한 Refresh Token 조회
        Optional<RedisRefreshToken> redisRefreshToken = redisRefreshTokenRepository.findByAccessToken(accessToken);
        if (redisRefreshToken.isEmpty()) {
            System.out.println("No Refresh Token found for Access Token: " + accessToken);
            sendErrorResponse(response, "Refresh token is missing", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 쿠키에서 Refresh Token 추출
        String refreshToken = extractRefreshToken(request);
        if (refreshToken == null) {
            System.out.println("No Refresh Token in cookies");
            sendErrorResponse(response, "Refresh token is missing", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        Long storedUserId = Long.parseLong(redisRefreshToken.get().getId());
        Long tokenUserId = Long.parseLong(jwtUtil.getUserId(accessToken));

        // Access Token이 사용자 ID와 일치하는지 확인
        if (!storedUserId.equals(tokenUserId)) {
            System.out.println("Access Token does not belong to the expected user");
            sendErrorResponse(response, "Invalid access token", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Refresh Token 유효성 검사
        if (!validateRefreshToken(refreshToken, storedUserId)) {
            System.out.println("Invalid Refresh Token for User ID: " + storedUserId);
            // Refresh Token이 유효하지 않은 경우 로그아웃 처리
            sendErrorResponse(response, "Invalid refresh token", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 새로운 Access Token 발급
        String newAccessToken = jwtUtil.createJwt("access", storedUserId, getUserRole(storedUserId));
        System.out.println("New Access Token issued: " + newAccessToken);

        // Redis에 새 Access Token 저장
        redisRefreshTokenService.saveRedisData(storedUserId, refreshToken, newAccessToken);

        // 응답 헤더에 새로운 Access Token 추가
        response.setHeader("Authorization", "Bearer " + newAccessToken);
        authenticateUser(newAccessToken);
    }

    // Refresh Token을 쿠키에서 추출하는 메소드 (예시)
    private String extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    // Refresh Token 유효성 검사 메소드 (예시)
    private boolean validateRefreshToken(String refreshToken, Long userId) {
        // Redis 또는 데이터베이스에서 Refresh Token과 userId를 검증하는 로직 구현
        return redisRefreshTokenRepository.existsByRefreshTokenAndUserId(refreshToken, userId);
    }


    private void authenticateUser(String token) {
        System.out.println("Authenticating with token: " + token);

        Long userId = Long.parseLong(jwtUtil.getUserId(token));
        System.out.println("Extracted User ID from token: " + userId);

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("Found User: " + user.getUsername() + " (ID: " + user.getUserId() + ")");

        CustomUserDetails customUserDetails = CustomUserDetails.builder()
                                                               .userId(user.getUserId())
                                                               .email(user.getEmail())
                                                               .username(user.getUsername())
                                                               .role(user.getRole())
                                                               .build();
        System.out.println("CustomUserDetails created: " + customUserDetails.getUsername());

        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null,
                customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
        System.out.println("Authentication set for user: " + customUserDetails.getUsername());
    }


    private String getUserRole(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getRole().toString();
    }


    private void sendErrorResponse(HttpServletResponse response, String message, int status) throws IOException {
        response.setStatus(status);
        response.getWriter().print(message);
    }

    private String extractToken(HttpServletRequest request) {
        String accessToken = request.getHeader("Authorization");
        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            return accessToken.substring(7);
        }
        return null;
    }

//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//            throws ServletException, IOException {
//        log.info("-------jwt filter-------");
//
//        // Authorization 헤더에서 Bearer 토큰을 추출
//        String accessToken = request.getHeader("Authorization");
//        if (accessToken != null && accessToken.startsWith("Bearer ")) {
//            accessToken = accessToken.substring(7); // "Bearer " 부분을 제거
//        }
//        System.out.println("Extracted Access Token: " + accessToken); // 추가
//
//        // Access Token 유무 확인
//        if (accessToken == null || accessToken.isEmpty()) {
//            System.out.println("Access Token is missing"); // 추가
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().print("Access token is missing");
//            return;
//        }
//
//        // accessToken 만료됐을 경우
//        if (jwtUtil.isExpired(accessToken)) {
//            System.out.println("Access Token has expired."); // Access Token 만료 확인
//
//            // Redis에서 Access Token으로 Refresh Token 조회
//            Optional<RedisRefreshToken> redisRefreshTokenOpt = redisRefreshTokenRepository.findByAccessToken(accessToken);
//            if (redisRefreshTokenOpt.isPresent()) {
//                String refreshToken = redisRefreshTokenOpt.get().getRefreshToken();
//                System.out.println("Refresh Token retrieved from Redis: " + refreshToken); // Redis에서 가져온 Refresh Token
//
//                Long userId = Long.parseLong(redisRefreshTokenOpt.get().getId());
//                System.out.println("User ID extracted from Access Token: " + userId); // User ID 추출 확인
//
//                User user = userRepository.findById(userId)
//                                          .orElseThrow(() -> new RuntimeException("User not found"));
//
//                // Redis에서 Refresh Token 확인
//                Optional<RedisRefreshToken> redisRefreshToken = redisRefreshTokenRepository.findById(String.valueOf(userId));
//                if (redisRefreshToken.isPresent()) {
//                    System.out.println("Refresh Token found in Redis for User ID: " + userId); // Redis에서 Refresh Token 확인
//
//                    // Redis에 저장된 Refresh Token과 클라이언트에서 받은 Refresh Token 비교
//                    if (redisRefreshToken.get().getRefreshToken().equals(refreshToken)) {
//                        System.out.println("Refresh Token is valid."); // Refresh Token 유효성 확인
//
//                        // 새로운 Access Token 발급
//                        String newAccessToken = jwtUtil.createJwt("access", userId, user.getRole().toString());
//                        response.setHeader("Authorization", "Bearer " + newAccessToken);
//                        System.out.println("New Access Token issued: " + newAccessToken); // 새로운 Access Token 발급 확인
//
//                        accessToken = newAccessToken;
//
//                        CustomUserDetails customUserDetails = CustomUserDetails.builder()
//                                                                               .userId(user.getUserId())
//                                                                               .email(user.getEmail())
//                                                                               .username(user.getUsername())
//                                                                               .role(user.getRole())
//                                                                               .build();
//
//                        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null,
//                                customUserDetails.getAuthorities());
//                        SecurityContextHolder.getContext().setAuthentication(authToken);
//
//                        // 필터 체인 종료 - 더 이상의 로직이 실행되지 않도록 return
//                        filterChain.doFilter(request, response);
//                        return;
//                    } else {
//                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                        response.getWriter().print("Invalid refresh token");
//                        System.out.println("Invalid Refresh Token received."); // 유효하지 않은 Refresh Token 확인
//                        return;
//                    }
//                } else {
//                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                    response.getWriter().print("Refresh token is missing");
//                    System.out.println("No Refresh Token found in Redis for User ID: " + userId); // Redis에 Refresh Token 없음 확인
//                    return;
//                }
//            } else {
//                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                response.getWriter().print("Refresh token is missing");
//                System.out.println("Refresh Token is null or not found."); // Refresh Token이 null이거나 없음 확인
//                return;
//            }
//        }
//
//
//
//        // 사용자 정보 가져오기
//        Long userId = Long.parseLong(jwtUtil.getUserId(accessToken));
//        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
//
//        // CustomUserDetails 객체 생성
//        CustomUserDetails customUserDetails = CustomUserDetails.builder()
//                                                               .userId(user.getUserId())
//                                                               .email(user.getEmail())
//                                                               .username(user.getUsername())
//                                                               .role(user.getRole())
//                                                               .build();
//
//        // SecurityContext에 인증 정보 설정
//        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null,
//                customUserDetails.getAuthorities());
//        SecurityContextHolder.getContext().setAuthentication(authToken);
//        // 인증 정보 로그 추가
//        System.out.println("Authentication set in SecurityContext: " + customUserDetails.getUsername());
//        System.out.println("CustomUserDetails");
//        System.out.println(customUserDetails.getUserId());
//        System.out.println(customUserDetails.getEmail());
//        System.out.println(customUserDetails.getUsername());
//        System.out.println(customUserDetails.getPassword());
//        System.out.println(customUserDetails.getRole());
//        log.info("-------jwt filter done-------");
//        // 필터 체인 계속 진행
//        filterChain.doFilter(request, response);
//    }

}
