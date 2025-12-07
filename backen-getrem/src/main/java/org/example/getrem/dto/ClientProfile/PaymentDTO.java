package org.example.getrem.dto.ClientProfile;

import lombok.Getter;
import lombok.Setter;
import org.example.getrem.enums.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class PaymentDTO {

    private UUID id;

    private BigDecimal amountPaid;
    private LocalDate paymentDate;
    private PaymentMethod method;

    private String staffName;


}
