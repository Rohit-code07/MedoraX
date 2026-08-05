package com.project.medicineRemainder.controller;

import com.project.medicineRemainder.Entity.User;
import com.project.medicineRemainder.Security.jwtUtil;
import com.project.medicineRemainder.dto.userDto;
import com.project.medicineRemainder.dto.userloginDto;
import com.project.medicineRemainder.service.userServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class userController {

    @Autowired
    private userServices userService;

    @Autowired
    private jwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody userDto dto){
        User user = userService.signup(dto);
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody userloginDto dto){
        User user = userService.login(dto);
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        return ResponseEntity.ok(response);
    }

}