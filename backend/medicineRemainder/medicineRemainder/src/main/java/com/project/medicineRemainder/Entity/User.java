package com.project.medicineRemainder.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;
import net.minidev.json.annotate.JsonIgnore;

import java.util.List;

@Entity
@Setter
@Getter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Email
    private String email;
    @JsonIgnore
    private String password;
    @Column(name = "fcmtoken")
    private String FCMtoken;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "user")
    private List<Medicine> medicines;
    @OneToMany(cascade = CascadeType.ALL,mappedBy = "user")
    private List<medicineLog> medicineLogs;
}
