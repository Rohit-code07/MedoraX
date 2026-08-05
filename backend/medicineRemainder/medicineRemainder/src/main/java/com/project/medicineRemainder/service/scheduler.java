package com.project.medicineRemainder.service;

import com.project.medicineRemainder.Entity.Medicine;
import com.project.medicineRemainder.repository.medicinerepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class scheduler {
    @Autowired
    private medicinerepo medicineRepo;

    @Autowired
    private NotificationService notificationService;

    // Har 1 min me run hoga
    @Scheduled(fixedRate = 60000)
    public void checkMedicineTime() {

        List<Medicine> medicines = medicineRepo.findAll();
        LocalTime now = LocalTime.now();

        for (Medicine m : medicines) {

            String token = m.getUser().getFCMtoken();

            // ✅ Ye check add karo
            if (token == null || token.isEmpty()) {
                System.err.println("❌ No FCM token for user: " + m.getUser().getId());
                continue;
            }

            if ((m.getTime().getHour() == now.getHour()) &&
                    (m.getTime().getMinute() == now.getMinute())) {

                System.out.println("🔔 Sending notification for medicine: " + m.getName());
                notificationService.sendNotification(
                        token,
                        "Smart Reminder",
                        "Time to take " + m.getName()
                );
            }
        }
    }
}

