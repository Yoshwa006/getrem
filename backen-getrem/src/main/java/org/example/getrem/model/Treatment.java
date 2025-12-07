package org.example.getrem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.getrem.enums.TreatmentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Entity
@Getter
@Setter
public class Treatment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Clients client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal totalAmount;

    private String description;
    private String name;
    @Column(nullable = false)
    private LocalDate createdAt;

    private TreatmentStatus treatmentStatus;

    @JsonIgnore
    @OneToMany(mappedBy = "treatment", cascade = CascadeType.ALL)
    private Set<Payment> payments = new HashSet<>();

    public BigDecimal getTotalPaid() {
        return payments.stream()
                .map(Payment::getAmountPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getRemainingBalance() {
        return totalAmount.subtract(getTotalPaid());
    }

}

