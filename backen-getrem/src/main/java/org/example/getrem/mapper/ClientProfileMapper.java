package org.example.getrem.mapper;

import org.example.getrem.dto.ClientProfile.PaymentDTO;
import org.example.getrem.dto.ClientProfile.TreatmentDTO;
import org.example.getrem.dto.client.ClientProfileDTO;
import org.example.getrem.model.Clients;
import org.example.getrem.model.Payment;
import org.example.getrem.model.Treatment;

import java.math.BigDecimal;
import java.util.List;

public class ClientProfileMapper {

    public ClientProfileDTO toClientProfile(Clients client) {

        ClientProfileDTO dto = new ClientProfileDTO();
        dto.setName(client.getName());
        dto.setAge(client.getAge() != null ? client.getAge().toString() : null);
        dto.setGender(client.getGender());
        dto.setEmail(client.getEmail());
        dto.setNotes(client.getNotes());
        dto.setPhone(client.getPhone());
        dto.setStatus(client.getStatus());

        List<TreatmentDTO> treatmentDTOs = client.getTreatments()
                .stream()
                .map(this::toTreatmentDTO)
                .toList();

        dto.setTreatments(treatmentDTOs);

        List<PaymentDTO> paymentDTOs = client.getTreatments()
                .stream()
                .flatMap(t -> t.getPayments().stream())
                .map(this::toPaymentDTO)
                .toList();

        dto.setPayments(paymentDTOs);

        BigDecimal totalPaidBD = paymentDTOs.stream()
                .map(PaymentDTO::getAmountPaid)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        dto.setTotalPaid(totalPaidBD.longValue());

        BigDecimal totalCostBD = treatmentDTOs.stream()
                .map(TreatmentDTO::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        dto.setBalance(totalCostBD.subtract(totalPaidBD).longValue());

        return dto;
    }

    private TreatmentDTO toTreatmentDTO(Treatment treatment) {
        TreatmentDTO dto = new TreatmentDTO();
        dto.setId(treatment.getId());
        dto.setName(treatment.getName());
        dto.setDescription(treatment.getDescription());
        dto.setCreatedAt(treatment.getCreatedAt());
        dto.setTotalAmount(treatment.getTotalAmount());
        dto.setTreatmentStatus(treatment.getTreatmentStatus());
        return dto;
    }

    private PaymentDTO toPaymentDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmountPaid(payment.getAmountPaid());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setMethod(payment.getMethod());
        dto.setStaffName(payment.getStaffName());
        return dto;
    }
}
