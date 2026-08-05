package com.project.medicineRemainder.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendNotification(String token, String title, String body) {

        // Token null check
        if (token == null || token.isEmpty()) {
            System.err.println("❌ FCM Token is null or empty, skipping...");
            return;
        }

        try {
            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(          // ✅ Ye add karo — yahi main fix hai
                            Notification.builder()
                                    .setTitle(title)
                                    .setBody(body)
                                    .build()
                    )
                    .putData("title", title)
                    .putData("body", body)
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            System.out.println("✅ Notification sent: " + response);

        } catch (FirebaseMessagingException e) {
            System.err.println("❌ FCM Error: " + e.getMessagingErrorCode());
            System.err.println("❌ Details: " + e.getMessage());
        }
    }
}