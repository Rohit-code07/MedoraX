package com.project.medicineRemainder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MedicineRemainderApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedicineRemainderApplication.class, args);
	}

}
