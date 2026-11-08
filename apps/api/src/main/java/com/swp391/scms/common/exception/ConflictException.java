package com.swp391.scms.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a conflict occurs with the current state of a resource (HTTP 409).
 */
public class ConflictException extends AppException {

    public ConflictException(String message) {
        super(HttpStatus.CONFLICT, "CONFLICT", message);
    }

    public ConflictException(String errorCode, String message) {
        super(HttpStatus.CONFLICT, errorCode, message);
    }

    public ConflictException(String errorCode, String message, Object details) {
        super(HttpStatus.CONFLICT, errorCode, message, details);
    }

    public ConflictException(String errorCode, String messageKey, Object[] messageArgs, String fallbackMessage) {
        super(HttpStatus.CONFLICT, errorCode, messageKey, messageArgs, fallbackMessage);
    }
}
