package com.project.medicineRemainder.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiMedicineResponse {
    @JsonProperty("medicine_name")
    private String medicineName;

    @JsonProperty("answer")
    private String answer;
}
