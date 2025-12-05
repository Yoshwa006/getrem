package org.example.getrem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.example.getrem.enums.Gender;

import java.util.UUID;

@Entity
@Getter
@Setter
public class Clients {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private Integer age;
    private Gender gender;
    private String phone;
    private String email;
    private String notes;
}
