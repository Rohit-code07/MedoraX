package com.project.medicineRemainder.controller;
import com.project.medicineRemainder.dto.explainDto;
import com.project.medicineRemainder.dto.medicineDto;
import com.project.medicineRemainder.dto.medicineResponseDto;
import com.project.medicineRemainder.service.GeminiServices;
import com.project.medicineRemainder.service.OCRservices;
import com.project.medicineRemainder.service.explainServices;
import com.project.medicineRemainder.service.medicineServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Base64;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"})
@RestController
@RequestMapping("/api/medicines")
public class medicineController {


        @Autowired
        private medicineServices medicineService;
        @Autowired
        private OCRservices ocrservices;
        // ✅ Add Medicine
        @PostMapping
        public medicineDto addMedicine(@RequestBody medicineDto medicineDTO) {
            return medicineService.addMedicine(medicineDTO);
        }

        // ✅ Get All Medicines
        @GetMapping
        public List<medicineDto> getAllMedicines() {
            return medicineService.getAllMedicine();
        }

        // ✅ Get Medicine By ID
        @GetMapping("/{id}")
        public medicineDto getMedicineById(@PathVariable Long id) {
            return medicineService.getMedicineById(id);
        }

        // ✅ Update Medicine
        @PutMapping("/{id}")
        public medicineDto updateMedicine(@PathVariable Long id,
                                          @RequestBody medicineDto medicineDTO) {
            return medicineService.updateMedicine(id, medicineDTO);
        }

        // ✅ Delete Medicine
        @DeleteMapping("/{id}")
        public String deleteMedicine(@PathVariable Long id) {
            medicineService.deleteMedicine(id);
            return "Medicine deleted successfully";
        }

        // ✅ Mark Taken
        @PutMapping("/{id}/taken")
        public ResponseEntity<Void> markTaken(@PathVariable Long id) {
            medicineService.markMedicineTaken(id);
            return ResponseEntity.ok().build();
        }

        // ✅ Mark Missed
        @PutMapping("/{id}/missed")
        public ResponseEntity<Void> markMissed(@PathVariable Long id) {
            medicineService.markMedicineMissed(id);
            return ResponseEntity.ok().build();
        }
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
        @Autowired
        private GeminiServices geminiServices;
    @PostMapping("/process-prescription")
    public String processPrescription(
            @RequestParam MultipartFile prescription,
            @RequestParam MultipartFile medicineImage
    ) throws Exception {

        // ⏱ small delay (avoid rate limit)
        Thread.sleep(1200);

        // ── Step 1: OCR ─────────────────────────
        File file = new File("temp_prescription.jpg");
        prescription.transferTo(file);

        String extractedText = ocrservices.extractText(file);
        file.delete();

        if (extractedText == null || extractedText.isBlank()) {
            return "❌ Could not read prescription";
        }

        // Clean OCR text
        extractedText = extractedText.replace("$00", "500");

        // ── Step 2: Convert image to Base64 ─────
        String base64 = Base64.getEncoder()
                .encodeToString(medicineImage.getBytes());

        // ── Step 3: SINGLE Gemini Call ──────────
        String result = geminiServices.analyzeAll(extractedText, base64);

        System.out.println("=== OCR TEXT === " + extractedText);
        System.out.println("=== FULL RESULT === " + result);

        // ── Step 4: Extract verdict ─────────────
        String verdict = extractField(result, "verdict");

        if ("MATCH".equalsIgnoreCase(verdict)) {
            return "✅ Match";
        } else if ("MISMATCH".equalsIgnoreCase(verdict)) {
            return "❌ Mismatch";
        } else {
            return "⚠️ Not sure";
        }
    }
    @Autowired
    private explainServices geminiService;

    @PostMapping("/explain")
    public ResponseEntity<medicineResponseDto> explainMedicine(
            @RequestBody explainDto request) {

        medicineResponseDto response = geminiService.getMedicineInfo(request);
        return ResponseEntity.ok(response);
    }
}
