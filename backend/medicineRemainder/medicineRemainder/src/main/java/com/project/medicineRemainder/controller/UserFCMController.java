package com.project.medicineRemainder.controller;

import com.project.medicineRemainder.Entity.User;
import com.project.medicineRemainder.repository.userrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserFCMController {

    @Autowired
    private userrepo userRepo;

    @PostMapping("/fcm-token")
    public ResponseEntity<?> saveFCMToken(
            @RequestParam Long userId,
            @RequestParam String token) {

        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        user.setFCMtoken(token);
        userRepo.save(user);
        return ResponseEntity.ok("FCM Token saved");
    }
}
