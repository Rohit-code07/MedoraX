package com.project.medicineRemainder.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class medicineResponseDto {


        private String name;
        private String medicineClass;
        private String use;
        private String dosage;
        private String sideEffects;
        private String tips;



    }

