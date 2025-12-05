package org.example.getrem.mapper;

import org.example.getrem.dto.billing.CreatePaymentRequest;
import org.example.getrem.dto.billing.PaymentResponse;
import org.example.getrem.model.Payment;
import org.example.getrem.model.Treatment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public Payment toEntity(CreatePaymentRequest request, Treatment treatment) {
        if (request == null || treatment == null) {
            return null;
        }
        Payment payment = new Payment();
        payment.setTreatment(treatment);
        payment.setAmountPaid(request.getAmountPaid());
        payment.setPaymentDate(request.getPaymentDate());
        payment.setMethod(request.getMethod());
        payment.setStaffName(request.getStaffName());
        return payment;
    }

    public PaymentResponse toResponse(Payment entity) {
        if (entity == null) {
            return null;
        }
        return PaymentResponse.builder()
                .id(entity.getId())
                .treatmentId(entity.getTreatment().getId())
                .amountPaid(entity.getAmountPaid())
                .paymentDate(entity.getPaymentDate())
                .method(entity.getMethod())
                .staffName(entity.getStaffName())
                .build();
    }
}

