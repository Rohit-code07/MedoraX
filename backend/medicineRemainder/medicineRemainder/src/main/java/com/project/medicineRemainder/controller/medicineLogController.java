package com.project.medicineRemainder.controller;

import com.project.medicineRemainder.Entity.User;
import com.project.medicineRemainder.dto.medicineLogDto;
import com.project.medicineRemainder.repository.userrepo;
import com.project.medicineRemainder.service.medicineLogServices;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class medicineLogController {

        @Autowired
        private final medicineLogServices analyticsService;
        @Autowired
        private userrepo userRepository;

        // Single endpoint — returns everything for the dashboard
        @GetMapping("/{userId}")
        public ResponseEntity<Map<String, Object>> getFullAnalytics(@PathVariable Long userId) {
            return ResponseEntity.ok(analyticsService.getFullAnalytics(userId));
        }

        // Individual endpoints (optional, for granular access)

        @GetMapping("/{userId}/streak")
        public ResponseEntity<Map<String, Object>> getStreak(@PathVariable Long userId) {
            return ResponseEntity.ok(Map.of("dayStreak", analyticsService.getDayStreak(userId)));
        }

        @GetMapping("/{userId}/weekly-rate")
        public ResponseEntity<Map<String, Object>> getWeeklyRate(@PathVariable Long userId) {
            return ResponseEntity.ok(Map.of("weeklyRate", analyticsService.getWeeklyRate(userId)));
        }

        @GetMapping("/{userId}/best-medicine")
        public ResponseEntity<Map<String, Object>> getBestMedicine(@PathVariable Long userId) {
            return ResponseEntity.ok(Map.of("bestMedicine", analyticsService.getBestMedicine(userId)));
        }

        @GetMapping("/{userId}/most-missed")
        public ResponseEntity<Map<String, Object>> getMostMissed(@PathVariable Long userId) {
            return ResponseEntity.ok(Map.of("mostMissed", analyticsService.getMostMissedMedicine(userId)));
        }

        @GetMapping("/{userId}/weekly-chart")
        public ResponseEntity<List<Map<String, Object>>> getWeeklyChart(@PathVariable Long userId) {
            return ResponseEntity.ok(analyticsService.getWeeklyChart(userId));
        }

        @GetMapping("/{userId}/per-medicine-rate")
        public ResponseEntity<List<Map<String, Object>>> getPerMedicineRate(@PathVariable Long userId) {
            return ResponseEntity.ok(analyticsService.getPerMedicineRate(userId));
        }
    @GetMapping("/heatmap")
    public ResponseEntity<?> getHeatmap(Authentication authentication) {

        Long userId = Long.parseLong(authentication.getName());
        System.out.println("UserId from JWT: " + userId);

        return ResponseEntity.ok(analyticsService.getHeatmapData(userId));
    }
}


