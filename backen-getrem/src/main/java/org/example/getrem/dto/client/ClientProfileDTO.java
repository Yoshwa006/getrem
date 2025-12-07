package org.example.getrem.dto.client;

import lombok.Getter;
import lombok.Setter;
import org.example.getrem.dto.ClientProfile.PaymentDTO;
import org.example.getrem.dto.ClientProfile.TreatmentDTO;
import org.example.getrem.enums.ClientStatus;
import org.example.getrem.enums.Gender;

import java.util.List;

@Getter
@Setter
public class ClientProfileDTO {

    private String name;
    private String age;
    private Gender gender;
    private String email;
    private String notes;
    private String phone;
    private ClientStatus status;
    private List<TreatmentDTO> treatments;
    private List<PaymentDTO> payments;

    private Long totalPaid;
    private Long balance;
}
