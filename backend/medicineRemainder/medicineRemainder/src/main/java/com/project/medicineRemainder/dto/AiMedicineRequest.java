package com.project.medicineRemainder.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiMedicineRequest {
    @JsonProperty("medicine_name")
    private String medicineName;

    @JsonProperty("question")
    private String question;
}
