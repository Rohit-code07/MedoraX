package com.project.medicineRemainder.controller;

import com.project.medicineRemainder.Entity.Remainder;
import com.project.medicineRemainder.Entity.status;
import com.project.medicineRemainder.dto.RemainderDto;
import com.project.medicineRemainder.service.remainderServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/remainder")
public class ReminderController {

        @Autowired
        private remainderServices remainderService;

        @PostMapping("/create")
        public String createReminder(@RequestBody RemainderDto dto){
            remainderService.saveRemainder(dto);
            return "Reminder created successfully";
        }

        @GetMapping("/all")
        public List<Remainder> getAllReminder(){
            return remainderService.getAllRemainder();
        }
    @PutMapping("/update-status/{id}")
    public void updateStatus(@PathVariable Long id, @RequestParam status st){
        remainderService.updateStatus(id, st);
    }
}
