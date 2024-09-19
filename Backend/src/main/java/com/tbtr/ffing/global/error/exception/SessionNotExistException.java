package com.tbtr.ffing.global.error.exception;

import com.tbtr.ffing.global.error.code.CommonErrorCode;
import com.tbtr.ffing.global.error.code.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Custom exception for REST API errors.
 */
@Getter
@RequiredArgsConstructor
public class SessionNotExistException extends RuntimeException {

    private final ErrorCode errorCode = CommonErrorCode.SESSION_NOT_EXIST; // Error code associated with the exception
}
