package com.project.medicineRemainder.controller;

import com.project.medicineRemainder.dto.*;
import com.project.medicineRemainder.service.FastAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(originPatterns = "*")
public class AiIntegrationController {

    private final FastAiService fastAiService;

    @Autowired
    public AiIntegrationController(FastAiService fastAiService) {
        this.fastAiService = fastAiService;
    }

    @PostMapping("/explain")
    public ResponseEntity<AiMedicineResponse> explainMedicine(@RequestBody(required = false) AiMedicineRequest request) {
        if (request == null) {
            request = new AiMedicineRequest("Not specified", "Explain medicine");
        }
        AiMedicineResponse response = fastAiService.explainMedicine(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/prescription")
    public ResponseEntity<AiPrescriptionResponse> analyzePrescription(@RequestBody(required = false) AiPrescriptionRequest request) {
        if (request == null) {
            request = new AiPrescriptionRequest("No prescription text provided");
        }
        AiPrescriptionResponse response = fastAiService.analyzePrescription(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody(required = false) AiChatRequest request) {
        if (request == null) {
            request = new AiChatRequest("Hello");
        }
        AiChatResponse response = fastAiService.chat(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> status = fastAiService.checkHealth();
        return ResponseEntity.ok(status);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        return ResponseEntity.ok(Map.of(
            "response", "MedoraX AI Service assistant is currently unavailable: " + e.getMessage(),
            "answer", "MedoraX AI Service assistant is currently unavailable: " + e.getMessage(),
            "error", e.getMessage()
        ));
    }
}
