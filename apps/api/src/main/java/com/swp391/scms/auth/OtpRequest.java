package com.swp391.scms.auth;

public record OtpRequest(String email, String phoneNumber) {
    public String target() {
        return (email != null && !email.isBlank()) ? email.trim() : phoneNumber;
    }
}