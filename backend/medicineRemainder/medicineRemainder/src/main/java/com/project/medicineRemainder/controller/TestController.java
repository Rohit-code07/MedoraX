package com.project.medicineRemainder.controller;

import com.project.medicineRemainder.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
@RestController
@RequestMapping("/test")
public class TestController {


        @Autowired
        private NotificationService notificationService;

        @GetMapping("/send")
        public String send(@RequestParam String token){

            notificationService.sendNotification(
                    token,
                    "Test",
                    "Hello Rohit 🚀"
            );

            return "Sent";
        }
         @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
    }

