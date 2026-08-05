package com.project.medicineRemainder.repository;

import com.project.medicineRemainder.Entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface medicinerepo extends JpaRepository<Medicine,Long> {
    List<Medicine> findByUserId(Long userId);
// Spring Data JPA automatically implement karega — kuch aur likhne ki zaroorat nahi
}
