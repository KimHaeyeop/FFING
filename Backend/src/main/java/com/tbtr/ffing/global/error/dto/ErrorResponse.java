package com.tbtr.ffing.global.error.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.FieldError;

import java.util.List;

/**
 * DTO for error response which will be returned to the client.
 */
@Getter
@Builder
@AllArgsConstructor
public class ErrorResponse {

    private final String code; // Error code
    private final String message; // Error message

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private final List<ValidationError> errors; // List of validation errors if any

    /**
     * Inner class representing validation error details.
     */
    @Getter
    @Builder
    @RequiredArgsConstructor
    public static class ValidationError {

        private final String field; // Field that caused the error
        private final String message; // Error message related to the field

        /**
         * Factory method to create ValidationError from FieldError.
         *
         * @param fieldError FieldError object
         * @return ValidationError object
         */
        public static ValidationError of(final FieldError fieldError) {
            return ValidationError.builder()
                    .field(fieldError.getField())
                    .message(fieldError.getDefaultMessage())
                    .build();
        }
    }
}
