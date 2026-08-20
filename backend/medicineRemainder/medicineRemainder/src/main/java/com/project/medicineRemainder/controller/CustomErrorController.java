package com.project.medicineRemainder.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class CustomErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);

        int statusCode = 500;
        if (status != null) {
            try {
                statusCode = Integer.parseInt(status.toString());
            } catch (Exception ignored) {}
        }

        String errMsg = "An unexpected error occurred on the server";
        if (message != null && !message.toString().isBlank()) {
            errMsg = message.toString();
        } else if (exception instanceof Exception) {
            errMsg = ((Exception) exception).getMessage();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", statusCode);
        response.put("error", statusCode == 404 ? "Not Found" : (statusCode == 401 ? "Unauthorized" : "Internal Server Error"));
        response.put("message", errMsg);

        return ResponseEntity.status(statusCode).body(response);
    }
}
