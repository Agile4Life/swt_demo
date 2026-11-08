package com.swp391.scms.common.exception;

import org.springframework.http.HttpStatus;

public class ServiceUnavailableException extends AppException {
    public ServiceUnavailableException(String message) {
        super(HttpStatus.SERVICE_UNAVAILABLE, "SERVICE_UNAVAILABLE", message);
    }

    public ServiceUnavailableException(String errorCode, String messageKey, Object[] messageArgs, String fallbackMessage) {
        super(HttpStatus.SERVICE_UNAVAILABLE, errorCode, messageKey, messageArgs, fallbackMessage);
    }
}
