package com.swp391.scms.auth;

public interface OtpDeliveryPort {
    void send(String destination, String code);
}
