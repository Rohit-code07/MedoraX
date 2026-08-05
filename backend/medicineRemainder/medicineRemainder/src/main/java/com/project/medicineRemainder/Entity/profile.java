package com.project.medicineRemainder.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
@Getter
@Setter
public class profile {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        // ─── Basic Info ───────────────────────────────
        private String name;
        private String email;
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

        @OneToOne
        @JoinColumn(name = "user_id", nullable = false, unique = true)
        private User user;              // ✅ yeh hona zaroori hai findByUserId ke liye

        private String emergencyContactName;
        private String emergencyContactPhone;

        // ─── Meta ─────────────────────────────────────
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        @PrePersist
        protected void onCreate() { createdAt = updatedAt = LocalDateTime.now(); }

        @PreUpdate
        protected void onUpdate() { updatedAt = LocalDateTime.now(); }
    }

