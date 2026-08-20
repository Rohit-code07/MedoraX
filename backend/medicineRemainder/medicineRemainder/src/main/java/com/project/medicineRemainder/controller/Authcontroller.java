package com.project.medicineRemainder.controller;

import com.project.medicineRemainder.Entity.User;
import com.project.medicineRemainder.repository.userrepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.frontend.url:http://127.0.0.1:5500}")
@RestController
public class Authcontroller {

    @Autowired
    private userrepo userRepo;

    @Value("${app.frontend.url:http://127.0.0.1:5500}")
    private String frontendUrl;

    // ── OAuth success → dashboard ─────────────────────────────
    @GetMapping("/success")
    public void loginSuccess(HttpServletResponse response) throws IOException {
        response.sendRedirect(frontendUrl + "/dashboard");
    }

    // ── OAuth failure → login with error ─────────────────────
    @GetMapping("/failure")
    public void loginFailure(HttpServletResponse response) throws IOException {
        response.sendRedirect(frontendUrl + "/auth?error=login_failed");
    }

    // ── Current user — works for both JWT (Bearer token) and OAuth2 ───────────────
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        Object principal = auth.getPrincipal();
        Map<String, Object> response = new HashMap<>();

        if (principal instanceof Long userId) {
            User user = userRepo.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            response.put("userId", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("fcmToken", user.getFCMtoken());
            return ResponseEntity.ok(response);
        } else if (principal instanceof OAuth2User oauthUser) {
            String email = getAttr(oauthUser, "email");
            User user = userRepo.findByEmail(email).orElse(null);
            if (user != null) {
                response.put("userId", user.getId());
                response.put("name", user.getName());
                response.put("email", user.getEmail());
                response.put("fcmToken", user.getFCMtoken());
            } else {
                response.put("name", getAttr(oauthUser, "name"));
                response.put("email", email);
                response.put("picture", getAttr(oauthUser, "picture"));
            }
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }

    // ── Logout ────────────────────────────────────────────────
    @PostMapping("/logout")
    public void logout(HttpServletRequest req, HttpServletResponse res) throws IOException {
        new SecurityContextLogoutHandler().logout(req, res, SecurityContextHolder.getContext().getAuthentication());
        res.sendRedirect(frontendUrl + "/auth");
    }

    private String getAttr(OAuth2User p, String key) {
        Object v = p.getAttribute(key);
        return v != null ? v.toString() : "";
    }
}

