package com.project.medicineRemainder.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Base64;

@Configuration   // 🔥 IMPORTANT
public class firebaseconfigure {

    @Value("${FIREBASE_CONFIG_BASE64}")
    private String firebaseConfigBase64;

    @PostConstruct
    public void init() throws Exception {

        if (firebaseConfigBase64 == null || firebaseConfigBase64.isEmpty()) {
            throw new RuntimeException("FIREBASE_CONFIG_BASE64 is missing ❌");
        }

        byte[] decoded = Base64.getDecoder().decode(firebaseConfigBase64);
        InputStream serviceAccount = new ByteArrayInputStream(decoded);

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }

        System.out.println("🔥 Firebase Initialized Successfully");
    }
}
