package com.project.medicineRemainder.controller;

import com.project.medicineRemainder.service.GeminiServices;
import com.project.medicineRemainder.service.OCRservices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/mismatch")
@CrossOrigin(originPatterns = "*")
public class misMatchcontroller {

    @Autowired
    private GeminiServices geminiServices;

    @Autowired
    private OCRservices ocrServices;

    // ─────────────────────────────────────────────────────────────
    // MAIN API
    // ─────────────────────────────────────────────────────────────
    @PostMapping(value = "/check", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> checkMismatch(
            @RequestPart("prescription") MultipartFile prescription,
            @RequestPart(value = "medicineImage", required = false) MultipartFile medicineImage,
            @RequestPart(value = "medicineName", required = false) String medicineName
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            // ⏱ small delay to avoid rate limit
            Thread.sleep(2500);
            // ── Step 1: OCR ─────────────────────────────
            File rxFile = multipartToTempFile(prescription, "rx_", ".png");
            String ocrText = ocrServices.extractText(rxFile);
            rxFile.delete();

            if (ocrText == null || ocrText.isBlank()) {
                response.put("error", "Could not extract text. Upload clearer image.");
                return ResponseEntity.badRequest().body(response);
            }

            // Clean OCR (important)
            ocrText = ocrText.replace("$00", "500");

            response.put("ocrText", ocrText);

            String fullResult;

            // ── IMAGE MODE ─────────────────────────────
            if (medicineImage != null && !medicineImage.isEmpty()) {

                byte[] imageBytes = medicineImage.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);

                fullResult = geminiServices.analyzeAll(ocrText, base64Image);

                response.put("identifiedMedicine",
                        extractField(fullResult, "detected_medicine"));
                response.put("medicineIdentifiedFrom", "image");

            }
            // ── TEXT MODE ─────────────────────────────
            else if (medicineName != null && !medicineName.isBlank()) {

                String combinedText = ocrText +
                        "\nMedicine provided by user: " + medicineName.trim();

                fullResult = geminiServices.analyzeAll(combinedText, null);

                response.put("identifiedMedicine", medicineName.trim());
                response.put("medicineIdentifiedFrom", "text");

            } else {
                // ── PRESCRIPTION OCR ONLY MODE ─────────────────────────
                fullResult = geminiServices.analyzeAll(ocrText, null);
                response.put("identifiedMedicine", "Prescription Scan");
                response.put("medicineIdentifiedFrom", "ocr");
            }

            System.out.println("=== OCR TEXT === " + ocrText);
            System.out.println("=== FULL RESULT === " + fullResult);
            if (fullResult.contains("rate_limited")) {
                response.put("error", "AI busy, try again in few seconds");
                response.put("success", false);
                return ResponseEntity.ok(response);
            }
            String aiText = geminiServices.extractTextFromGemini(fullResult);
            String verdict = aiText.contains("MATCH") ? "MATCH" : "MISMATCH";
            response.put("prescriptionAnalysis", fullResult);
            response.put("aiResponse", aiText);
            response.put("verdict", verdict);
            response.put("success", true);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Server error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // OCR ONLY
    // ─────────────────────────────────────────────────────────────
    @PostMapping(value = "/ocr-only", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> ocrOnly(
            @RequestPart("prescription") MultipartFile prescription
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            File rxFile = multipartToTempFile(prescription, "rx_", ".png");
            String ocrText = ocrServices.extractText(rxFile);
            rxFile.delete();

            response.put("ocrText", ocrText);
            response.put("success", true);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("error", "OCR failed");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // IDENTIFY MEDICINE ONLY
    // ─────────────────────────────────────────────────────────────
    @PostMapping(value = "/identify-medicine", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> identifyMedicine(
            @RequestPart("medicineImage") MultipartFile medicineImage
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            byte[] imageBytes = medicineImage.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            String result = geminiServices.analyzeAll(
                    "Identify medicine from this image only",
                    base64Image
            );

            String aiText = geminiServices.extractTextFromGemini(result);

            response.put("medicineName", aiText);
            response.put("success", true);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("error", "Image processing failed");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // ─────────────────────────────────────────────────────────────
    // FILE HELPER
    // ─────────────────────────────────────────────────────────────
    private File multipartToTempFile(MultipartFile multipart, String prefix, String suffix) throws IOException {
        File temp = Files.createTempFile(prefix, suffix).toFile();
        multipart.transferTo(temp);
        return temp;
    }

    // ─────────────────────────────────────────────────────────────
    // JSON FIELD EXTRACTOR
    // ─────────────────────────────────────────────────────────────
    private String extractField(String json, String fieldName) {
        if (json == null) return "Unknown";
        try {
            String key = "\"" + fieldName + "\"";
            int idx = json.indexOf(key);
            if (idx == -1) return "Unknown";

            int start = json.indexOf("\"", idx + key.length()) + 1;
            int end = json.indexOf("\"", start);

            return json.substring(start, end);
        } catch (Exception e) {
            return "Unknown";
        }
    }

}