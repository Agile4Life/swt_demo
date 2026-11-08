package com.swp391.scms.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when the client request is invalid or malformed (HTTP 400).
 */
public class BadRequestException extends AppException {

    public BadRequestException(String message) {
        super(HttpStatus.BAD_REQUEST, "BAD_REQUEST", message);
    }

    public BadRequestException(String errorCode, String message) {
        super(HttpStatus.BAD_REQUEST, errorCode, message);
    }

    public BadRequestException(String errorCode, String message, Object details) {
        super(HttpStatus.BAD_REQUEST, errorCode, message, details);
    }

    public BadRequestException(String errorCode, String messageKey, Object[] messageArgs, String fallbackMessage) {
        super(HttpStatus.BAD_REQUEST, errorCode, messageKey, messageArgs, fallbackMessage);
    }
}
