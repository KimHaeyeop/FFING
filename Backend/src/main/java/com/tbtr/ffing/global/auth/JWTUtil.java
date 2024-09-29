package com.tbtr.ffing.global.auth;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTUtil {

    private final SecretKey secretKey;
    @Value("${jwt.access.expiration}")
    private Long ACCESS_TOKEN_EXPIRATION_PERIOD;
    @Value("${jwt.refresh.expiration}")
    private Long REFRESH_TOKEN_EXPIRATION_PERIOD;

    public JWTUtil(@Value("${jwt.secret}") String secret) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
                Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public String getUserId(String token) {
        try {
            return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload()
                       .get("userId", String.class);
        } catch (ExpiredJwtException e) {
            // 만료된 토큰에서도 userId를 추출할 수 있도록 예외 처리
            return e.getClaims().get("userId", String.class);
        } catch (JwtException e) {
            // 다른 JWT 관련 예외 발생 시 처리
            System.out.println("JWT parsing error: " + e.getMessage());
            return null;
        }
    }

    public String getRole(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload()
                   .get("role", String.class);
    }

    public String getCategory(String token) {

        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload()
                   .get("category", String.class);
    }

    public Boolean isExpired(String token) {
        System.out.println("JWTUtil: Checking if the token is expired..."); // 로그 추가
        System.out.println("현재시간: " + new Date(System.currentTimeMillis()));

        Date expirationDate = null;
        try {
            expirationDate = Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload()
                                 .getExpiration();
        } catch (ExpiredJwtException e) {
            System.out.println("Token is expired: " + e.getMessage());
            return true; // 토큰이 만료된 경우 true 반환
        } catch (JwtException e) {
            System.out.println("JWT parsing error: " + e.getMessage());
            return true; // 파싱 에러가 발생한 경우도 true 반환
        }

        System.out.println("expirationDate: " + expirationDate);
        Date currentDate = new Date();

        // 토큰의 만료 날짜와 현재 날짜를 출력
        System.out.println("Token Expiration Date: " + expirationDate);
        System.out.println("Current Date: " + currentDate);

        return expirationDate.before(currentDate);
    }

    public String createJwt(String category, Long userId, String role) {

        Long expirationPeriod =
                category.equals("access") ? ACCESS_TOKEN_EXPIRATION_PERIOD : REFRESH_TOKEN_EXPIRATION_PERIOD;

        return Jwts.builder()
                   .claim("category", category)
                   .claim("userId", userId.toString())
                   .claim("role", role)
                   .issuedAt(new Date(System.currentTimeMillis()))
                   .expiration(new Date(System.currentTimeMillis() + expirationPeriod * 500L)) // 30초
                   .signWith(secretKey)
                   .compact();
    }

}
