package com.swp391.scms.security;

public record AuthenticatedPrincipal(Long id, String username, String role) {}
