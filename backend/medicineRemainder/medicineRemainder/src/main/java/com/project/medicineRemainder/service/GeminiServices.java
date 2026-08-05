package com.project.medicineRemainder.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.time.Duration;

@Service
public class GeminiServices {

    private final WebClient webClient = WebClient.create();
    @Value("${gemini.api.key}")
    private final String API_KEY = "your_api_key_here"; // your key

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";
    // analyzeAll: prescription text + optional medicine image
    public String analyzeAll(String prescriptionText, String base64Image) {
        String prompt = """
Compare these medicines.

Prescription: %s
User Medicine: %s

Rules:
- Same salt = MATCH
- Ignore dosage

Example:
Crocin vs Paracetamol → MATCH
Dolo vs Azithromycin → MISMATCH

Answer ONLY in JSON:
{"verdict":"MATCH or MISMATCH","medicine":"name"}
""".formatted(prescriptionText, "from image or user input");

        String body = """
{
  "model": "llama3-70b-8192",
  "messages": [
    {
      "role": "user",
      "content": "%s"
    }
  ]
}
""".formatted(prompt);

        return webClient.post()
                .uri(GROQ_URL)
                .header("Authorization", "Bearer " + API_KEY)                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .retryWhen(Retry.backoff(1, Duration.ofSeconds(5)))                .onErrorReturn("{\"error\": \"rate_limited\"}")
                .block();
       // 1.2 sec → 2.5 sec
    }
    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "");
    }
    public String extractTextFromGemini(String json) {
        try {
            int start = json.indexOf("\"text\": \"") + 9;
            int end = json.indexOf("\"", start);
            return json.substring(start, end);
        } catch (Exception e) {
            return "ERROR";
        }
    }
}