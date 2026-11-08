package com.swp391.scms.common.exception;

import org.springframework.http.HttpStatus;

public class TooManyRequestsException extends AppException {
    public TooManyRequestsException(String errorCode, String message) {
        super(HttpStatus.TOO_MANY_REQUESTS, errorCode, message);
    }

    public TooManyRequestsException(String errorCode, String messageKey, Object[] messageArgs, String fallbackMessage) {
        super(HttpStatus.TOO_MANY_REQUESTS, errorCode, messageKey, messageArgs, fallbackMessage);
    }
}