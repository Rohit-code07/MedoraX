package com.project.medicineRemainder.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class explainDto {


        private String medicineName;   // Text input se
        private String imageBase64;    // Image upload se (base64 encoded)

//        public String getMedicineName() { return medicineName; }
//        public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
//
//        public String getImageBase64() { return imageBase64; }
//        public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }
}


