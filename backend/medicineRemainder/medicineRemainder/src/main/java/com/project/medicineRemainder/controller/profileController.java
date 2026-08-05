package com.project.medicineRemainder.controller;

import com.project.medicineRemainder.dto.profileDto;
import com.project.medicineRemainder.service.profileServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class profileController {

    private final profileServices profileService;

    @PostMapping
    public ResponseEntity<profileDto> create(
            @RequestParam Long userId,
            @RequestBody profileDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(profileService.createProfile(userId, dto));
    }

    @PutMapping
    public ResponseEntity<profileDto> update(
            @RequestParam Long userId,
            @RequestBody profileDto dto) {
        return ResponseEntity.ok(profileService.createOrUpdateProfile(userId, dto)); // ✅
    }

    @GetMapping
    public ResponseEntity<profileDto> get(
            @RequestParam Long userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }
}
