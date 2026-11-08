package com.swp391.scms.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Base custom runtime exception for SCMS application with i18n support.
 */
public class AppException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;
    private final String messageKey;
    private final Object[] messageArgs;
    private final Object details;

    public AppException(HttpStatus status, String errorCode, String message, Object details) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
        this.messageKey = null;
        this.messageArgs = null;
        this.details = details;
    }

    public AppException(HttpStatus status, String errorCode, String message) {
        this(status, errorCode, message, null);
    }

    public AppException(HttpStatus status, String errorCode, String messageKey, Object[] messageArgs, String fallbackMessage) {
        super(fallbackMessage != null ? fallbackMessage : messageKey);
        this.status = status;
        this.errorCode = errorCode;
        this.messageKey = messageKey;
        this.messageArgs = messageArgs;
        this.details = null;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getMessageKey() {
        return messageKey;
    }

    public Object[] getMessageArgs() {
        return messageArgs;
    }

    public Object getDetails() {
        return details;
    }
}
