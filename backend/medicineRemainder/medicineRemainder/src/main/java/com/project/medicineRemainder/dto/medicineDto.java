package com.project.medicineRemainder.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.medicineRemainder.Entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
public class medicineDto {
    private Long id;
    private String name;
    private String dosage;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;

    private String frequency;   // FIX: Long → String ("Once daily" accept karne ke liye)

    private String category;

    private Long stock;
    private Long maxStock;      // FIX: missing tha

    private String color;       // FIX: "colour" → "color" (frontend se match)
    private String notes;       // FIX: "Notes" → "notes" (lowercase)

    private boolean takenToday; // FIX: missing tha

    private User users;

    public Long getUserId() {
        return users != null ? users.getId() : null;
    }
}