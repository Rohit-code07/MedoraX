package com.project.medicineRemainder.repository;

import com.project.medicineRemainder.Entity.profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface profileRepo extends JpaRepository<profile, Long> {
    Optional<profile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}