package com.project.medicineRemainder.dto;

import com.project.medicineRemainder.Entity.status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class RemainderDto {
    private LocalTime time;
    private LocalDate date;
    private status Remainderstatus;
}
