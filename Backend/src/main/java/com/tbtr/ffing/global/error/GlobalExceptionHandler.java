package com.tbtr.ffing.global.error;

import com.tbtr.ffing.global.error.entity.ErrorResponseEntity;
import com.tbtr.ffing.global.error.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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

    // default error 처리
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponseEntity> handleDefaultException(Exception e){
        ErrorResponseEntity errorResponse = new ErrorResponseEntity(600, "UNCHECKED_ERROR", "An unexpected error occurred");

        e.printStackTrace();

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);  // Send a generic 500 status code
    }

}
