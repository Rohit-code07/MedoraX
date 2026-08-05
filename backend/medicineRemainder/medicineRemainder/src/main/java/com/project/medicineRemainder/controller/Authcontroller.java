package com.project.medicineRemainder.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.frontend.url}")
@RestController
public class Authcontroller {

        // application.properties se URLs read karo
        @Value("${app.frontend.url:http://127.0.0.1:5500}")
        private String frontendUrl;

        // ── OAuth success → dashboard ─────────────────────────────
        @GetMapping("/success")
        public void loginSuccess(HttpServletResponse response) throws IOException {
            response.sendRedirect(frontendUrl + "/dashBoard/dashboard.html");
        }

        // ── OAuth failure → login with error ─────────────────────
        @GetMapping("/failure")
        public void loginFailure(HttpServletResponse response) throws IOException {
            response.sendRedirect(frontendUrl + "/login-page/index.html?error=login_failed");
        }

        // ── Current user — 401 if not authenticated ───────────────
        @GetMapping("/me")
        public ResponseEntity<?> getCurrentUser(
                @AuthenticationPrincipal OAuth2User principal) {

            if (principal == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Not authenticated"));
            }

            Map<String, Object> user = new HashMap<>();
            user.put("name",    getAttr(principal, "name"));
            user.put("email",   getAttr(principal, "email"));
            user.put("picture", getAttr(principal, "picture"));

            return ResponseEntity.ok(user);
        }

        // ── Logout ────────────────────────────────────────────────
        @PostMapping("/logout")
        public void logout(HttpServletRequest req,
                           HttpServletResponse res) throws IOException {
            new SecurityContextLogoutHandler()
                    .logout(req, res,
                            SecurityContextHolder.getContext().getAuthentication());
            res.sendRedirect(frontendUrl + "/login-page/index.html");
        }

        private String getAttr(OAuth2User p, String key) {
            Object v = p.getAttribute(key);
            return v != null ? v.toString() : "";
        }
    }

