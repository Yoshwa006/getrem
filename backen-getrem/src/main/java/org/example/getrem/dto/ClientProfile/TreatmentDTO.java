package org.example.getrem.dto.ClientProfile;


import lombok.Getter;
import lombok.Setter;
import org.example.getrem.enums.TreatmentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class TreatmentDTO {
    UUID id;
    private BigDecimal totalAmount;
    private LocalDate createdAt;

    private TreatmentStatus treatmentStatus;

    private String description;
    private String name;


}
