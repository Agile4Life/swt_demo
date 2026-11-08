package com.swp391.scms.common;

/**
 * Standard Error Response class, extending ApiResponse for backward compatibility.
 */
public class ErrorResponse extends ApiResponse<Object> {

    public ErrorResponse(int status, String code, String message, Object details) {
        super(false, status, message, null, code, details);
    }

    public ErrorResponse(int status, String code, String message) {
        super(false, status, message, null, code, null);
    }
}