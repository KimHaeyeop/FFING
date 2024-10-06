package com.tbtr.ffing.global.error.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Enum to represent common error codes used in the application.
 */
@Getter
@AllArgsConstructor
public enum ErrorCode {

    /*
    User, Auth 관련 오류
     */
    AUTH_DEFAULT_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "AUTH-001", "회원 관련 오류가 발생했습니다."),
    INCORRECT_PASSWORD(HttpStatus.UNAUTHORIZED, "AUTH-002", "이메일 또는 비밀번호가 올바르지 않습니다."),
    ACCESS_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AUTH-003", "액세스 토큰이 만료되었습니다."),
    REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AUTH-004", "리프레시 토큰이 만료되었습니다."),
    ACCESS_TOKEN_NOT_FOUND(HttpStatus.NOT_FOUND, "AUTH-005", "액세스 토큰이 존재하지 않습니다."),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.NOT_FOUND, "AUTH-006", "리프레시 토큰이 존재하지 않습니다."),
    INVALID_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH-007", "유효하지 않은 액세스 토큰입니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH-008", "유효하지 않은 리프레시 토큰입니다."),

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER-001", "사용자가 발견되지 않았습니다."),
    EMAIL_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "USER-002", "이미 사용 중인 이메일입니다."),
    NICKNAME_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "USER-003", "이미 사용 중인 닉네임입니다."),

    /*
    Stock 관련 오류
     */
    STOCK_ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "STOCK-001", "사용자의 주식 계좌가 없습니다."),
    STOCK_TRANSACTION_NOT_FOUND(HttpStatus.NOT_FOUND, "STOCK-002", "사용자의 거래내역을 찾을 수 없습니다."),

    /*
    Battle 관련 오류
     */
    BATTLE_NOT_EXISTS(HttpStatus.NOT_FOUND, "BATTLE-001", "해당 배틀이 존재하지 않습니다."),

    ;

    private final HttpStatus httpStatus; // HTTP status code associated with the error
    private final String code;      // Custom error code
    private final String message; // Error message to be shown
}
