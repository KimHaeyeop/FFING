package com.tbtr.ffing.global.error.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * Enum to represent common error codes used in the application.
 */
@Getter
@RequiredArgsConstructor
public enum CommonErrorCode implements ErrorCode {

    INVALID_PARAMETER(HttpStatus.BAD_REQUEST, "Invalid parameter included"),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "Resource not exists"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error"),
    DATA_SERIALIZATION_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Data 직렬화 실패"),
    DATA_DESERIALIZATION_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Data 역직렬화 실패"),

    /*
    * Session 관련 오류
    * */
    FULL_CAPACITY_USERS(HttpStatus.SERVICE_UNAVAILABLE, "제한 인원 초과"),
    SESSION_NOT_EXIST(HttpStatus.NOT_FOUND, "존재하지 않는 세션"),
    OPENVIDU_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "openvidu 오류"),

    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다.")
    ;

    private final HttpStatus httpStatus; // HTTP status code associated with the error
    private final String message; // Error message to be shown
}
