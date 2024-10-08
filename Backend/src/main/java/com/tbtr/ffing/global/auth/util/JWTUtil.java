package com.tbtr.ffing.global.auth.util;

import com.tbtr.ffing.domain.user.dto.CustomUserDetails;
import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.CustomException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.InvalidClaimException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
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

    /**
     * 토큰 유효성 검사 (expired 제외) - 토큰의 유효기간 만료는 다른 메소드로 관리함
     */
    public void validateToken(String token) {

        try {
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
        } catch (ExpiredJwtException e) {
            throw e;
        } catch (MalformedJwtException e) {
            throw new CustomException(ErrorCode.MALFORMED_TOKEN);
        } catch (UnsupportedJwtException e) {
            throw new CustomException(ErrorCode.UNSUPPORTED_TOKEN);
        } catch (InvalidClaimException invalidClaimException) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.TOKEN_DEFAULT_ERROR);
        }
    }

    public Long getUserId(String token) {
        validateToken(token);
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload()
                   .get("userId", Long.class);
    }

    public Boolean isExpired(String token) {
        try {
            validateToken(token);
            System.out.println(
                    "@@@@@@@token 만료 : " + Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token)
                                               .getPayload().getExpiration());
        } catch (ExpiredJwtException e) {
            return true;
        }
        return false;
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
