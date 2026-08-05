package com.project.medicineRemainder.service;

import com.project.medicineRemainder.Entity.Remainder;
import com.project.medicineRemainder.Entity.status;
import com.project.medicineRemainder.dto.RemainderDto;
import com.project.medicineRemainder.repository.remainderrepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class remainderServices {
    @Autowired
    private remainderrepo remainder1;
    public void saveRemainder(RemainderDto rmder){
        Remainder remainders=new Remainder();
        remainders.setDate(rmder.getDate());
        remainders.setTime(rmder.getTime());
        remainders.setRemainderstatus(status.PENDING);
        remainder1.save(remainders);
    }
    public List<Remainder> getAllRemainder(){
        return remainder1.findAll();
    }
    public void updateStatus(Long id,status st){

        Remainder r = remainder1.findById(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        r.setRemainderstatus(st);

        remainder1.save(r);
    }

}
