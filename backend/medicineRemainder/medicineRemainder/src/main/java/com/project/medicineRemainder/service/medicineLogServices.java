package com.project.medicineRemainder.service;

import com.project.medicineRemainder.Entity.Medicine;
import com.project.medicineRemainder.Entity.User;
import com.project.medicineRemainder.Entity.medicineLog;
import com.project.medicineRemainder.dto.medicineLogDto;
import com.project.medicineRemainder.repository.medicineLogrepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class medicineLogServices {

        private final medicineLogrepo medicineLogrepo;

        // ─────────────────────────────────────────────
        // 1. DAY STREAK  →  "13 Day Streak 🔥"
        // ─────────────────────────────────────────────
        void saveMedicineLog(Medicine medicine, boolean taken) {

            LocalDate today = LocalDate.now();

            List<medicineLog> existing =
                    medicineLogrepo.findByUserIdAndDate(medicine.getUser().getId(), today);

            Optional<medicineLog> existingLog = existing.stream()
                    .filter(l -> l.getMedicineName() != null &&
                            l.getMedicineName().equals(medicine.getName()))
                    .findFirst();

            if (existingLog.isPresent()) {
                // 🔥 UPDATE existing log
                medicineLog log = existingLog.get();
                log.setTaken(taken);
                log.setStatus(taken ? "TAKEN" : "MISSED");
                medicineLogrepo.save(log);
                return;
            }

            // ✅ CREATE new log
            medicineLog log = new medicineLog();
            log.setDate(today);
            log.setTaken(taken);
            log.setMedicineName(medicine.getName());
            log.setStatus(taken ? "TAKEN" : "MISSED");
            log.setUser(medicine.getUser());

            medicineLogrepo.save(log);
        }
        public int getDayStreak(Long userId) {
            List<medicineLog> logs = medicineLogrepo.findByUserIdOrderByDateDesc(userId);

            // Group by date → keep only dates where at least one dose was TAKEN
            Set<LocalDate> takenDates = logs.stream()
                    .filter(medicineLog::isTaken)
                    .map(medicineLog::getDate)
                    .collect(Collectors.toSet());

            int streak = 0;
            LocalDate cursor = LocalDate.now();

            while (takenDates.contains(cursor)) {
                streak++;
                cursor = cursor.minusDays(1);
            }

            return streak;
        }

        // ─────────────────────────────────────────────
        // 2. WEEKLY RATE  →  "0% — Last 7 days"
        // ─────────────────────────────────────────────
        public double getWeeklyRate(Long userId) {
            LocalDate end   = LocalDate.now();
            LocalDate start = end.minusDays(6);          // last 7 days inclusive

            int taken  = medicineLogrepo.countByUserIdAndDateBetweenAndTakenTrue(userId, start, end);
            int missed = medicineLogrepo.countByUserIdAndDateBetweenAndTakenFalse(userId, start, end);
            int total  = taken + missed;

            if (total == 0) return 0.0;
            return Math.round((taken * 100.0 / total) * 10) / 10.0;   // 1 decimal place
        }

        // ─────────────────────────────────────────────
        // 3. BEST MEDICINE  →  "chapter — Most consistent"
        // ─────────────────────────────────────────────
        public String getBestMedicine(Long userId) {
            List<medicineLog> logs = medicineLogrepo.findByUserId(userId);

            // Group by medicineName → calculate adherence % for each
            Map<String, long[]> stats = new HashMap<>();   // [taken, total]

            for (medicineLog log : logs) {
                String name = log.getMedicineName();
                if (name == null) continue;
                stats.putIfAbsent(name, new long[]{0, 0});
                stats.get(name)[1]++;                      // total++
                if (log.isTaken()) stats.get(name)[0]++;   // taken++
            }

            return stats.entrySet().stream()
                    .max(Comparator.comparingDouble(e ->
                            e.getValue()[1] == 0 ? 0 : (double) e.getValue()[0] / e.getValue()[1]))
                    .map(Map.Entry::getKey)
                    .orElse("N/A");
        }

        // ─────────────────────────────────────────────
        // 4. NEEDS ATTENTION  →  "paracetomaol — Most missed"
        // ─────────────────────────────────────────────
        public String getMostMissedMedicine(Long userId) {
            List<medicineLog> logs = medicineLogrepo.findByUserId(userId);

            Map<String, Long> missedCount = logs.stream()
                    .filter(l -> !l.isTaken() && l.getMedicineName() != null)
                    .collect(Collectors.groupingBy(medicineLog::getMedicineName, Collectors.counting()));

            return missedCount.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse("N/A");
        }

        // ─────────────────────────────────────────────
        // 5. WEEKLY CHART  →  Bar chart (Mon–Sun)
        //    Returns list of {date, taken, missed} for last 7 days
        // ─────────────────────────────────────────────
        public List<Map<String, Object>> getWeeklyChart(Long userId) {
            LocalDate end   = LocalDate.now();
            LocalDate start = end.minusDays(6);

            List<medicineLog> logs = medicineLogrepo.findByUserIdAndDateBetween(userId, start, end);

            // Group by date
            Map<LocalDate, List<medicineLog>> byDate = logs.stream()
                    .collect(Collectors.groupingBy(medicineLog::getDate));

            List<Map<String, Object>> result = new ArrayList<>();
            for (int i = 6; i >= 0; i--) {
                LocalDate day  = end.minusDays(i);
                List<medicineLog> dayLogs = byDate.getOrDefault(day, Collections.emptyList());

                long taken  = dayLogs.stream().filter(medicineLog::isTaken).count();
                long missed = dayLogs.stream().filter(l -> !l.isTaken()).count();

                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("date",   day.toString());
                entry.put("day",    day.getDayOfWeek().toString().substring(0, 3)); // "MON"
                entry.put("taken",  taken);
                entry.put("missed", missed);
                result.add(entry);
            }
            return result;
        }

        // ─────────────────────────────────────────────
        // 6. PER-MEDICINE RATE  →  Progress bars
        //    Returns list of {medicineName, adherencePercent}
        // ─────────────────────────────────────────────
        public List<Map<String, Object>> getPerMedicineRate(Long userId) {
            List<medicineLog> logs = medicineLogrepo.findByUserId(userId);

            Map<String, long[]> stats = new HashMap<>();

            for (medicineLog log : logs) {
                String name = log.getMedicineName();
                if (name == null) continue;
                stats.putIfAbsent(name, new long[]{0, 0});
                stats.get(name)[1]++;
                if (log.isTaken()) stats.get(name)[0]++;
            }

            return stats.entrySet().stream()
                    .map(e -> {
                        long taken = e.getValue()[0];
                        long total = e.getValue()[1];
                        double rate = total == 0 ? 0 : Math.round((taken * 100.0 / total) * 10) / 10.0;

                        Map<String, Object> map = new LinkedHashMap<>();
                        map.put("medicineName",     e.getKey());
                        map.put("adherencePercent", rate);
                        return map;
                    })
                    .sorted((a, b) -> Double.compare(
                            (double) b.get("adherencePercent"),
                            (double) a.get("adherencePercent")))
                    .collect(Collectors.toList());
        }

        // ─────────────────────────────────────────────
        // 7. FULL ANALYTICS RESPONSE  →  Single endpoint
        // ─────────────────────────────────────────────
        public Map<String, Object> getFullAnalytics(Long userId) {
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("dayStreak",        getDayStreak(userId));
            response.put("weeklyRate",       getWeeklyRate(userId));
            response.put("bestMedicine",     getBestMedicine(userId));
            response.put("mostMissed",       getMostMissedMedicine(userId));
            response.put("weeklyChart",      getWeeklyChart(userId));
            response.put("perMedicineRate",  getPerMedicineRate(userId));
            return response;
        }
    public List<Map<String, Object>> getHeatmapData(Long userId) {

        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(181); // last 6 months

        List<medicineLog> logs = medicineLogrepo.findByUserIdAndDateBetween(userId, start, end);

        // Group by date
        Map<LocalDate, List<medicineLog>> byDate = logs.stream()
                .collect(Collectors.groupingBy(medicineLog::getDate));

        List<Map<String, Object>> result = new ArrayList<>();

        for (int i = 181; i >= 0; i--) {
            LocalDate day = end.minusDays(i);
            List<medicineLog> dayLogs = byDate.getOrDefault(day, Collections.emptyList());

            long taken  = dayLogs.stream().filter(medicineLog::isTaken).count();
            long missed = dayLogs.stream().filter(l -> !l.isTaken()).count();

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", day.toString()); // "2026-03-27"
            entry.put("taken", taken);
            entry.put("missed", missed);

            result.add(entry);
        }

        return result;
    }
    }