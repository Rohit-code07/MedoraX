package com.project.medicineRemainder.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.medicineRemainder.dto.explainDto;
import com.project.medicineRemainder.dto.medicineResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.List;
import java.util.Map;

@Service
public class explainServices {
    // ─────────────────────────────────────────────────────────────────
// FILE: src/main/java/com/medireminder/service/GeminiService.java
//

        // application.properties mein set karo:
        // gemini.api.key=AIza...
        @Value("${gemini.api.key}")
        private String apiKey;

        private static final String GEMINI_URL =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

        private final RestTemplate restTemplate = new RestTemplate();
        private final ObjectMapper objectMapper = new ObjectMapper();

        public medicineResponseDto getMedicineInfo(explainDto request) {

            // ── Build prompt ──────────────────────────────────────────
            String prompt = buildPrompt(request);

            // ── Build Gemini API request body ─────────────────────────
            Map<String, Object> requestBody;

            if (request.getImageBase64() != null && !request.getImageBase64().isEmpty()) {
                // With image (multimodal)
                requestBody = Map.of(
                        "contents", List.of(Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt),
                                        Map.of("inline_data", Map.of(
                                                "mime_type", "image/jpeg",
                                                "data", request.getImageBase64()
                                        ))
                                )
                        ))
                );
            } else {
                // Text only
                requestBody = Map.of(
                        "contents", List.of(Map.of(
                                "parts", List.of(Map.of("text", prompt))
                        ))
                );
            }

            // ── HTTP call to Gemini ───────────────────────────────────
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            try {
                ResponseEntity<String> geminiResponse = restTemplate.postForEntity(
                        GEMINI_URL + "?key=" + apiKey,
                        entity,
                        String.class
                );

                // ── Parse Gemini response ─────────────────────────────
                String rawText = extractTextFromGemini(geminiResponse.getBody());

                // ── Parse the JSON that Gemini returns ────────────────
                return parseGeminiJson(rawText);

            } catch (Exception e) {
                throw new RuntimeException("Gemini API error: " + e.getMessage());
            }
        }

        // ── Prompt builder ────────────────────────────────────────────────────────
        private String buildPrompt(explainDto request) {
            String name = request.getMedicineName() != null ? request.getMedicineName() : "the medicine in the image";

            return """
            You are a medical information assistant. Provide clear, simple information about: %s

            Respond ONLY with a valid JSON object (no markdown, no extra text) in this exact format:
            {
              "name": "Medicine Name",
              "medicineClass": "Drug class / category",
              "use": "What it is used for (2-3 sentences, use <strong> tags for key terms)",
              "dosage": "Typical dosage information (use <strong> for important values)",
              "sideEffects": "<ul><li>Side effect 1</li><li>Side effect 2</li><li>Side effect 3</li></ul>",
              "tips": "Important tips and warnings (2-3 sentences)"
            }

            Keep language simple and easy to understand for a general audience.
            If the medicine is not recognized, still return the JSON with general advice.
            """.formatted(name);
        }

        // ── Extract text content from Gemini API response ─────────────────────────
        private String extractTextFromGemini(String responseBody) throws Exception {
            JsonNode root = objectMapper.readTree(responseBody);

            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.size() == 0) {
                throw new RuntimeException("No response from Gemini");
            }

            JsonNode parts = candidates.get(0)
                    .path("content")
                    .path("parts");

            if (!parts.isArray() || parts.size() == 0) {
                throw new RuntimeException("Invalid Gemini response structure");
            }

            return parts.get(0).path("text").asText();
        }

        // ── Parse the JSON text from Gemini into MedicineResponse ─────────────────
        private medicineResponseDto parseGeminiJson(String jsonText) throws Exception {
            // Clean up if Gemini wraps in markdown code blocks
            String cleaned = jsonText
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            return objectMapper.readValue(cleaned, medicineResponseDto.class);
        }
    }


