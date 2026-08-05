package com.project.medicineRemainder.repository;

import com.project.medicineRemainder.Entity.Remainder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface remainderrepo extends JpaRepository<Remainder, Long>{
  //  List<remainderrepo> getAllRemainder();
}
