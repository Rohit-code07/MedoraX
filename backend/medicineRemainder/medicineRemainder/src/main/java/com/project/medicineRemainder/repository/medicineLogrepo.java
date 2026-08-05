package com.project.medicineRemainder.repository;

import com.project.medicineRemainder.Entity.Medicine;
import com.project.medicineRemainder.Entity.medicineLog;
import org.checkerframework.checker.guieffect.qual.UI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface medicineLogrepo extends JpaRepository<medicineLog,Long> {
    List<medicineLog> findByUserId(Long UserId);

        // Weekly Chart ke liye — 7 din ka data
        List<medicineLog> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);

        // Day Streak ke liye
        List<medicineLog> findByUserIdOrderByDateDesc(Long userId);

        // Per-Medicine Rate ke liye
        List<medicineLog> findByUserIdAndMedicineName(Long userId, String medicineName);

        // Aaj ka record
        List<medicineLog> findByUserIdAndDate(Long userId, LocalDate date);

        // Taken count
        int countByUserIdAndDateBetweenAndTakenTrue(Long userId, LocalDate start, LocalDate end);

        // Missed count
        int countByUserIdAndDateBetweenAndTakenFalse(Long userId, LocalDate start, LocalDate end);
    }


