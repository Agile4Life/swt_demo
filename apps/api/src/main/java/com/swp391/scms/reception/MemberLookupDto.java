package com.swp391.scms.reception;

public record MemberLookupDto(Long userId, String membershipCode, String fullName, String email, String phone, String status) {
}