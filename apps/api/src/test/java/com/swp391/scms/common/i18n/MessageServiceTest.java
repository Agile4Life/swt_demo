package com.swp391.scms.common.i18n;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.context.support.ResourceBundleMessageSource;

import java.util.Locale;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("MessageService i18n Unit Tests")
class MessageServiceTest {

    private MessageService messageService;

    @BeforeEach
    void setUp() {
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasename("i18n/messages");
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setFallbackToSystemLocale(false);
        this.messageService = new MessageService(messageSource);
    }

    @Test
    @DisplayName("Should resolve Vietnamese message correctly")
    void shouldResolveVietnameseMessage() {
        String msg = messageService.getMessage("common.success", Locale.forLanguageTag("vi"));
        assertEquals("Thành công", msg);

        String paymentCreated = messageService.getMessage("finance.payment.created", Locale.forLanguageTag("vi"));
        assertEquals("Tạo giao dịch thanh toán thành công", paymentCreated);
    }

    @Test
    @DisplayName("Should resolve English message correctly")
    void shouldResolveEnglishMessage() {
        String msg = messageService.getMessage("common.success", Locale.ENGLISH);
        assertEquals("Success", msg);

        String paymentCreated = messageService.getMessage("finance.payment.created", Locale.ENGLISH);
        assertEquals("Payment transaction created successfully", paymentCreated);
    }

    @Test
    @DisplayName("Should format parameterized arguments in messages")
    void shouldFormatParameterizedMessages() {
        String viMsg = messageService.getMessage("finance.payment.invalid_status", Locale.forLanguageTag("vi"), "unknown_status");
        assertEquals("Trạng thái thanh toán không hợp lệ: unknown_status", viMsg);

        String enMsg = messageService.getMessage("finance.payment.invalid_status", Locale.ENGLISH, "unknown_status");
        assertEquals("Invalid payment status: unknown_status", enMsg);
    }

    @Test
    @DisplayName("Should return code or default message when key is not found")
    void shouldReturnDefaultWhenKeyMissing() {
        String missingCode = messageService.getMessage("missing.code.test", Locale.ENGLISH);
        assertEquals("missing.code.test", missingCode);

        String defaultMsg = messageService.getMessageOrDefault("missing.code.test", "Default Fallback");
        assertEquals("Default Fallback", defaultMsg);
    }

    @Test
    @DisplayName("Should resolve validation and resource keys in both VI and EN")
    void shouldResolveValidationAndResourceKeys() {
        assertEquals("Hội viên", messageService.getMessage("resource.member", Locale.forLanguageTag("vi")));
        assertEquals("Member", messageService.getMessage("resource.member", Locale.ENGLISH));

        assertEquals("Số tiền phải lớn hơn 0", messageService.getMessage("validation.payment.amount.min", Locale.forLanguageTag("vi")));
        assertEquals("Amount must be greater than 0", messageService.getMessage("validation.payment.amount.min", Locale.ENGLISH));

        assertEquals("Mã OTP đã được tạo thành công", messageService.getMessage("auth.otp.sent", Locale.forLanguageTag("vi")));
        assertEquals("OTP code has been generated successfully", messageService.getMessage("auth.otp.sent", Locale.ENGLISH));
    }
}
