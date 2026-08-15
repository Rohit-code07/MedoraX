package com.project.medicineRemainder.service;

import com.project.medicineRemainder.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class FastAiService {

    private final RestTemplate restTemplate;
    private final String aiServiceUrl;

    public FastAiService(@Value("${ai.service.url:http://localhost:8000}") String aiServiceUrl) {
        this.restTemplate = new RestTemplate();
        this.aiServiceUrl = aiServiceUrl.endsWith("/") ? aiServiceUrl.substring(0, aiServiceUrl.length() - 1) : aiServiceUrl;
    }

    public AiMedicineResponse explainMedicine(AiMedicineRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<AiMedicineRequest> entity = new HttpEntity<>(request, headers);

            return restTemplate.postForObject(
                aiServiceUrl + "/api/medicine/explain",
                entity,
                AiMedicineResponse.class
            );
        } catch (Exception e) {
            System.err.println("FastAPI explain medicine error: " + e.getMessage());
            return new AiMedicineResponse(
                request != null && request.getMedicineName() != null ? request.getMedicineName() : "Medicine",
                "AI service is temporarily unavailable: " + e.getMessage()
            );
        }
    }

    public AiPrescriptionResponse analyzePrescription(AiPrescriptionRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<AiPrescriptionRequest> entity = new HttpEntity<>(request, headers);

            return restTemplate.postForObject(
                aiServiceUrl + "/api/prescription/analyze",
                entity,
                AiPrescriptionResponse.class
            );
        } catch (Exception e) {
            System.err.println("FastAPI analyze prescription error: " + e.getMessage());
            return new AiPrescriptionResponse(
                "AI service is temporarily unavailable: " + e.getMessage()
            );
        }
    }

    public AiChatResponse chat(AiChatRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<AiChatRequest> entity = new HttpEntity<>(request, headers);

            return restTemplate.postForObject(
                aiServiceUrl + "/chat",
                entity,
                AiChatResponse.class
            );
        } catch (Exception e) {
            System.err.println("FastAPI chat error: " + e.getMessage());
            return new AiChatResponse(
                "AI assistant is temporarily unavailable. Please make sure Python AI Service is running on port 8000. Details: " + e.getMessage()
            );
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> checkHealth() {
        try {
            return restTemplate.getForObject(aiServiceUrl + "/health", Map.class);
        } catch (Exception e) {
            System.err.println("FastAPI health error: " + e.getMessage());
            return Map.of("status", "unreachable", "error", e.getMessage());
        }
    }
}
