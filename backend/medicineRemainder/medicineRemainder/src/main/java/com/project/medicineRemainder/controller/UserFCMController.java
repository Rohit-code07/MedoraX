package com.project.medicineRemainder.controller;

import com.project.medicineRemainder.Entity.User;
import com.project.medicineRemainder.repository.userrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/user")
public class UserFCMController {

    @Autowired
    private userrepo userRepo;

    @PostMapping("/fcm-token")
    public ResponseEntity<?> saveFCMToken(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String token,
            @RequestBody(required = false) Map<String, Object> body) {

        Long finalUserId = userId;
        String finalToken = token;

        if (body != null) {
            if (finalUserId == null && body.containsKey("userId") && body.get("userId") != null) {
                finalUserId = Long.valueOf(body.get("userId").toString());
            }
            if (finalToken == null && body.containsKey("token") && body.get("token") != null) {
                finalToken = body.get("token").toString();
            }
        }

        if (finalUserId == null || finalToken == null) {
            return ResponseEntity.badRequest().body("userId and token are required");
        }

        User user = userRepo.findById(finalUserId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        user.setFCMtoken(finalToken);
        userRepo.save(user);
        return ResponseEntity.ok("FCM Token saved");
    }
}
