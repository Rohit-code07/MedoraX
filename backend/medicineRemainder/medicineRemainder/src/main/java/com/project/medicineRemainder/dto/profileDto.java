package com.project.medicineRemainder.dto;
import jakarta.validation.constraints.Email;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class profileDto {
    private String name;
    @Email(message = "Valid email dalo")
    private String email;
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Valid emergency contact number dalo")
    private String phone;
    private Long Age;
    private String gender;          // MALE, FEMALE, OTHER

    private LocalDate dateOfBirth;  // age calculate karne ke liye

    // ─── Address ──────────────────────────────────
    private String addressLine;
    private String city;
    private String state;
    private String pincode;

    // ─── Medical History ──────────────────────────
    private String bloodGroup;      // A+, B+, O-, etc.


    private String emergencyContactName;
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Valid emergency contact number dalo")
    private String emergencyContactPhone;

}
