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
    NICKNAME_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "USER-001", "이미 사용 중인 이메일입니다."),

    /*
    Stock 관련 오류
     */
    STOCK_ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "STOCK-001", "사용자의 주식 계좌가 없습니다."),
    STOCK_TRANSACTION_NOT_FOUND(HttpStatus.NOT_FOUND, "STOCK-002", "사용자의 거래내역을 찾을 수 없습니다."),

    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AUTH-001", "인증되지 않은 사용자입니다.")
    ;

    private final HttpStatus httpStatus; // HTTP status code associated with the error
    private final String code;      // Custom error code
    private final String message; // Error message to be shown
}
