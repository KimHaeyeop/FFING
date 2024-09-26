package com.tbtr.ffing.global.error;

import com.tbtr.ffing.global.error.entity.ErrorResponseEntity;
import com.tbtr.ffing.global.error.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler to handle various exceptions across the application.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    protected ResponseEntity<ErrorResponseEntity> handleCustomException(CustomException e){
        return ErrorResponseEntity.toResponseEntity(e.getErrorCode());
    }

}
