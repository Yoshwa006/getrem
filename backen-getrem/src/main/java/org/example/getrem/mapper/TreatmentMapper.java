package org.example.getrem.mapper;

import org.example.getrem.dto.billing.CreateTreatmentRequest;
import org.example.getrem.dto.billing.TreatmentResponse;
import org.example.getrem.model.Appointment;
import org.example.getrem.model.Clients;
import org.example.getrem.model.Payment;
import org.example.getrem.model.Treatment;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class TreatmentMapper {

    public Treatment toEntity(CreateTreatmentRequest request, Clients client, Appointment appointment) {
        if (request == null || client == null) {
            return null;
        }
        Treatment treatment = new Treatment();
        treatment.setClient(client);
        treatment.setAppointment(appointment);
        treatment.setTotalAmount(request.getTotalAmount());
        treatment.setDescription(request.getDescription());
        treatment.setCreatedAt(LocalDate.now());
        return treatment;
    }

    public TreatmentResponse toResponse(Treatment entity, List<Payment> payments) {
        if (entity == null) {
            return null;
        }
        
        BigDecimal paidAmount = payments != null 
            ? payments.stream()
                .map(Payment::getAmountPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
            : BigDecimal.ZERO;
        
        BigDecimal remainingAmount = entity.getTotalAmount().subtract(paidAmount);
        
        return TreatmentResponse.builder()
                .id(entity.getId())
                .clientId(entity.getClient().getId())
                .appointmentId(entity.getAppointment() != null ? entity.getAppointment().getId() : null)
                .totalAmount(entity.getTotalAmount())
                .paidAmount(paidAmount)
                .remainingAmount(remainingAmount)
                .description(entity.getDescription())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}

