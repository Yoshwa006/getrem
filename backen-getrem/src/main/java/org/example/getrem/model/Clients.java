package org.example.getrem.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.getrem.enums.ClientStatus;
import org.example.getrem.enums.Gender;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
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

    private ClientStatus status;

    @OneToMany(mappedBy = "clients", cascade = CascadeType.ALL)
    private List<Treatment> treatments = new ArrayList<>();
}
