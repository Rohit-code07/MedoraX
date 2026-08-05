package com.project.medicineRemainder.dto;

import lombok.Getter;
import lombok.Setter;
import org.threeten.bp.LocalDate;

@Getter
@Setter
public class medicineLogDto {

    private Long userId;
    private String medicineName;
    private LocalDate date;
    private boolean taken;
    private String status;
}
