package com.swp391.scms.users.dto;

import jakarta.validation.constraints.Size;

public record CoachProfileUpdateDto(
    @Size(max = 150, message = "{validation.users.coach.specialization.max}")
    String specialization,
    
    String bio,
    
    @Size(max = 255, message = "{validation.users.coach.certification.max}")
    String certification
) {}
