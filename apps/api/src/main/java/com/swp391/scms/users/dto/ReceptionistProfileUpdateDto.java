package com.swp391.scms.users.dto;

import jakarta.validation.constraints.Size;

public record ReceptionistProfileUpdateDto(
    @Size(max = 50, message = "{validation.users.receptionist.shift.max}")
    String shift
) {}
