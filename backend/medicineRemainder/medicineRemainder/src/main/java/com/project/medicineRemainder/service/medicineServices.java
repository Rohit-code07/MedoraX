package com.project.medicineRemainder.service;

import com.project.medicineRemainder.Entity.Medicine;
import com.project.medicineRemainder.Entity.User;
import com.project.medicineRemainder.dto.medicineDto;
import com.project.medicineRemainder.repository.medicinerepo;
import com.project.medicineRemainder.repository.userrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class medicineServices {

    @Autowired
    private medicinerepo medicineRepo;

    @Autowired
    private userrepo userRepo;
    @Autowired
    private medicineLogServices medicinelogservices;
    // ✅ Add Medicine
    // ✅ Fix: userId JWT se lo, frontend payload se nahi
    public medicineDto addMedicine(medicineDto dto) {

        // JWT filter ne userId SecurityContext mein daal di hai
        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Medicine medicine = new Medicine();
        medicine.setName(dto.getName());
        medicine.setDosage(dto.getDosage());
        medicine.setTime(dto.getTime());
        medicine.setStock(dto.getStock());
        medicine.setMaxStock(dto.getMaxStock());   // ← yeh bhi set karo
        medicine.setFrequency(dto.getFrequency());
        medicine.setCategory(dto.getCategory());
        medicine.setColour(dto.getColor());
        medicine.setNotes(dto.getNotes());
        medicine.setTakenToday(dto.isTakenToday());
        System.out.println("TakenToday from DTO: " + dto.isTakenToday());

        medicine.setUser(user);

        Medicine saved = medicineRepo.save(medicine);
        return mapToDTO(saved);
    }
    public void markMedicineTaken(Long medicineId) {

        Medicine medicine = medicineRepo.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        medicine.setTakenToday(true);
        medicineRepo.save(medicine);

        // 🔥 log create
        medicinelogservices.saveMedicineLog(medicine, true);
    }
    public void markMedicineMissed(Long medicineId) {

        Medicine medicine = medicineRepo.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        medicine.setTakenToday(false);
        medicineRepo.save(medicine);

        // 🔥 log create
        medicinelogservices.saveMedicineLog(medicine, false);
    }
    // ✅ Get All
    public List<medicineDto> getAllMedicine() {
        Long userId = (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        return medicineRepo.findByUserId(userId)  // ← user-specific query
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    // ✅ Get By ID
    public medicineDto getMedicineById(Long id){
        Medicine m = medicineRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        return mapToDTO(m);
    }


    // ✅ Delete
    public void deleteMedicine(Long id){
        medicineRepo.deleteById(id);
    }
    // ✅ update
    public medicineDto updateMedicine(Long id, medicineDto dto) {
        Medicine medicine = medicineRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        medicine.setName(dto.getName());
        medicine.setDosage(dto.getDosage());
        medicine.setTime(dto.getTime());
        medicine.setStock(dto.getStock());
        medicine.setMaxStock(dto.getMaxStock());     // ← missing tha
        medicine.setFrequency(dto.getFrequency());
        medicine.setCategory(dto.getCategory());
        medicine.setColour(dto.getColor());
        medicine.setNotes(dto.getNotes());
        boolean oldValue = medicine.isTakenToday();
        boolean newValue = dto.isTakenToday();

        medicine.setTakenToday(newValue);
        medicineRepo.save(medicine);

        if (oldValue != newValue) {
            medicinelogservices.saveMedicineLog(medicine, newValue);
        }
        Medicine updated = medicineRepo.save(medicine);
        return mapToDTO(updated);
    }
    // ✅ Mapping Method (important)
    private medicineDto mapToDTO(Medicine m) {
        medicineDto dto = new medicineDto();

        dto.setId(m.getId());           // ✅ id set hoga
        dto.setName(m.getName());
        dto.setDosage(m.getDosage());
        dto.setTime(m.getTime());
        dto.setStock(m.getStock());
        dto.setMaxStock(m.getMaxStock()); // ← ye bhi missing tha
        dto.setFrequency(m.getFrequency());
        dto.setCategory(m.getCategory());
        dto.setNotes(m.getNotes());
        dto.setColor(m.getColour());
        dto.setTakenToday(m.isTakenToday());

        return dto;
    }
}