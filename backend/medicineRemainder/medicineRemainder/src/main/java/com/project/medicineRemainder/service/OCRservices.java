package com.project.medicineRemainder.service;

import net.sourceforge.tess4j.Tesseract;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
public class OCRservices {

    public String extractText(File file) {
        try {
            // Re-read and re-write the file through ImageIO to guarantee
            // a valid, uncorrupted image regardless of original format
            BufferedImage image = ImageIO.read(file);

            if (image == null) {
                System.err.println("OCR: ImageIO could not read file — " + file.getName());
                return "";
            }

            // Write as PNG to a new temp file (Tesseract handles PNG reliably)
            File cleanPng = File.createTempFile("ocr_clean_", ".png");
            ImageIO.write(image, "PNG", cleanPng);

            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath("C:/tessdata");
            tesseract.setLanguage("eng");

            String result = tesseract.doOCR(cleanPng);
            cleanPng.delete();
            return result;

        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}