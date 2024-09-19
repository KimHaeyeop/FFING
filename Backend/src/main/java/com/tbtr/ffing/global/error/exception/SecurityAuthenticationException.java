package com.tbtr.ffing.global.error.exception;

import com.tbtr.ffing.global.error.code.CommonErrorCode;
import com.tbtr.ffing.global.error.code.ErrorCode;
import lombok.Getter;
import org.springframework.security.core.AuthenticationException;

@Getter
public class SecurityAuthenticationException extends AuthenticationException {
    private final ErrorCode errorCode = CommonErrorCode.UNAUTHORIZED;
    public SecurityAuthenticationException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public SecurityAuthenticationException(String msg) {
        super(msg);
    }
}
