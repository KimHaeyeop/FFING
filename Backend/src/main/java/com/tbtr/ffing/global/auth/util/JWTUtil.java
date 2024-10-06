package com.tbtr.ffing.global.auth.util;

import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
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

    public Long getUserId(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload()
                   .get("userId", Long.class);
    }

    public Boolean isExpired(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration()
                   .before(new Date());
    }

    public String createJwt(String category, CustomUserDetails userDetails) {

        Long expirationPeriod =
                category.equals("access") ? ACCESS_TOKEN_EXPIRATION_PERIOD : REFRESH_TOKEN_EXPIRATION_PERIOD;

        return Jwts.builder()
                   .claims(userDetails.getClaims())
                   .issuedAt(new Date(System.currentTimeMillis()))
                   .expiration(new Date(System.currentTimeMillis() + expirationPeriod * 1000L))
                   .signWith(secretKey)
                   .compact();
    }

}
