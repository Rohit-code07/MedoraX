package com.project.medicineRemainder.repository;

import com.project.medicineRemainder.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface userrepo extends JpaRepository<User,Long> {
    List<User> findByName(String name);
   Optional<User> findByEmail(String email);

}

