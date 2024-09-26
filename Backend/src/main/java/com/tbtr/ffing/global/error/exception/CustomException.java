package com.tbtr.ffing.global.error.exception;

import com.tbtr.ffing.global.error.code.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomException extends RuntimeException {
    ErrorCode errorCode;
}
