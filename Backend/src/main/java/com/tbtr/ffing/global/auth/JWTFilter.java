package com.tbtr.ffing.global.auth;

import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import com.tbtr.ffing.global.redis.repository.RedisRefreshTokenRepository;
import io.jsonwebtoken.ExpiredJwtException;
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
    private final RedisRefreshTokenRepository redisRefreshTokenRepository;

    /*
     * * 토큰 검증없이 접근 가능한 api를 설정함
     * */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String[] excludePath = {"/api/v1/auth/signin", "/api/v1/auth/signup"};

        String path = request.getRequestURI();
        return Arrays.stream(excludePath).anyMatch(path::startsWith);
//        return true; // 테스트를 위해 모두 true로 열어둠(임시)
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        log.info("-------jwt check filter-------");

        // Authorization 헤더에서 Bearer 토큰을 추출
        String accessToken = request.getHeader("Authorization");
        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            accessToken = accessToken.substring(7); // "Bearer " 부분을 제거
        }
        System.out.println("Extracted Access Token: " + accessToken); // 추가

        // Access Token 유무 확인
        if (accessToken == null || accessToken.isEmpty()) {
            System.out.println("Access Token is missing"); // 추가
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("Access token is missing");
            return;
        }

        try {
            System.out.println("JWTFilter : Checking if the token is expired..."); // 추가
            jwtUtil.isExpired(accessToken); // 토큰 유효성 검사
            System.out.println("Token is valid."); // 추가
        } catch (ExpiredJwtException e) {
            System.out.println("Access token expired"); // 추가
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("Access token expired");
            return;
        }

        // 토큰의 카테고리 확인
        String category = jwtUtil.getCategory(accessToken);
        if (!category.equals("access")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("Invalid access token");
            return;
        }

        // 사용자 정보 가져오기
        Long userId = Long.parseLong(jwtUtil.getUserId(accessToken));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // CustomUserDetails 객체 생성
        CustomUserDetails customUserDetails = CustomUserDetails.builder()
                                                               .userId(user.getUserId())
                                                               .email(user.getEmail())
                                                               .username(user.getUsername())
                                                               .role(user.getRole())
                                                               .build();

        // SecurityContext에 인증 정보 설정
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null,
                customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
        // 인증 정보 로그 추가
        System.out.println("Authentication set in SecurityContext: " + customUserDetails.getUsername());
        System.out.println("CustomUserDetails");
        System.out.println(customUserDetails.getUserId());
        System.out.println(customUserDetails.getEmail());
        System.out.println(customUserDetails.getUsername());
        System.out.println(customUserDetails.getPassword());
        System.out.println(customUserDetails.getRole());
        // 필터 체인 계속 진행
        filterChain.doFilter(request, response);
    }
}
