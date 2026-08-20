package com.project.medicineRemainder.Security;

import com.project.medicineRemainder.Entity.User;
import com.project.medicineRemainder.service.userServices;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private jwtUtil jwtUtil;

    @Autowired
    private userServices userServices;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name  = oauthUser.getAttribute("name");
        if (name == null || name.isBlank()) {
            name = email != null ? email.split("@")[0] : "User";
        }

        User user = userServices.findOrCreateByEmail(email, name);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        String safeName = URLEncoder.encode(user.getName() != null ? user.getName() : "", StandardCharsets.UTF_8);
        String safeEmail = URLEncoder.encode(user.getEmail() != null ? user.getEmail() : "", StandardCharsets.UTF_8);

        String redirectUrl = frontendUrl + "/auth"
                + "?token=" + token
                + "&userId=" + user.getId()
                + "&name=" + safeName
                + "&email=" + safeEmail;

        response.sendRedirect(redirectUrl);
    }
}