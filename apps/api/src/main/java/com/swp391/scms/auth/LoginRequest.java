package com.swp391.scms.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "{validation.auth.username.not_blank}") String username,
    @NotBlank(message = "{validation.auth.password.not_blank}") String password
) {}