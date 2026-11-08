package com.swp391.scms.auth;

import com.swp391.scms.common.exception.ServiceUnavailableException;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.auth.otp.delivery", havingValue = "disabled", matchIfMissing = true)
public class UnavailableOtpDeliveryAdapter implements OtpDeliveryPort {
    @Override
    public void send(String destination, String code) {
        throw new ServiceUnavailableException("OTP_DELIVERY_DISABLED", "auth.otp.delivery_not_configured", null, null);
    }
}
