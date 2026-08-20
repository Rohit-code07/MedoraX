package com.project.medicineRemainder.service;

import com.project.medicineRemainder.Entity.User;
import com.project.medicineRemainder.dto.userDto;
import com.project.medicineRemainder.dto.userloginDto;
import com.project.medicineRemainder.repository.userrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class userServices {

    @Autowired
    private userrepo user1;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User signup(userDto dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        return user1.save(user);
    }

    public User login(userloginDto dto) {
        User user = user1
                .findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean passwordMatches = passwordEncoder.matches(dto.getPassword(), user.getPassword())
                || dto.getPassword().equals(user.getPassword());

        if (!passwordMatches) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
    public User getUserById(Long id) {
        return user1.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ✅ Google OAuth ke liye — email se user dhundo, nahi mila toh naya banao
    public User findOrCreateByEmail(String email, String name) {
        return user1.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setPassword(""); // Google user ka password empty hoga
            return user1.save(newUser);
        });
    }
}

