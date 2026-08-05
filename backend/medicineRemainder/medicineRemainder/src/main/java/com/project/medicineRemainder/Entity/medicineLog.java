package com.project.medicineRemainder.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class medicineLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private boolean taken;          // ✅ already hai

    private String medicineName;    // ✅ add karo — Per-Medicine Rate ke liye
    private String status;          // ✅ add karo — "TAKEN", "MISSED", "SKIPPED"

    @ManyToOne
    private User user;              // ✅ already hai

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
}
