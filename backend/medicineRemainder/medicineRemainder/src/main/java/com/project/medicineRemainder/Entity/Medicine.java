package com.project.medicineRemainder.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String dosage;
    private LocalTime time;
    private Long stock;
    private Long maxStock;       // FIX: missing tha

    private String frequency;
    private String category;
    private String colour;
    private String Notes;

    private boolean takenToday;  // FIX: missing tha — toggle kaam nahi karta tha

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "medicine")
    private List<Remainder> remainder;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}