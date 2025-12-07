package org.example.getrem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.getrem.enums.ClientStatus;
import org.example.getrem.enums.Gender;

import java.util.*;

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

    @JsonIgnore
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private Set<Treatment> treatments = new HashSet<>();
}
