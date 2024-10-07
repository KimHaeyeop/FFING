package com.tbtr.ffing.global.error.exception.exceptionType;

import com.tbtr.ffing.global.error.code.ErrorCode;
import com.tbtr.ffing.global.error.exception.CustomException;

public class CustomJWTException extends CustomException {

    public CustomJWTException(ErrorCode errorCode) {
        super(errorCode);
    }
}
