package com.swp391.scms.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when an authenticated user does not have permission for an action (HTTP 403).
 */
public class ForbiddenException extends AppException {

    public ForbiddenException(String message) {
        super(HttpStatus.FORBIDDEN, "FORBIDDEN", message);
    }

    public ForbiddenException(String errorCode, String message) {
        super(HttpStatus.FORBIDDEN, errorCode, message);
    }

    public ForbiddenException(String errorCode, String messageKey, Object[] messageArgs, String fallbackMessage) {
        super(HttpStatus.FORBIDDEN, errorCode, messageKey, messageArgs, fallbackMessage);
    }
}
