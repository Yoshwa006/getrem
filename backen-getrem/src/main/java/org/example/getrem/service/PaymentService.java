package org.example.getrem.service;

import org.example.getrem.dto.billing.PaymentResponse;
import org.example.getrem.dto.billing.CreatePaymentRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface PaymentService {

    PaymentResponse createPayment(CreatePaymentRequest request);

    PaymentResponse getPaymentById(UUID id);

    Page<PaymentResponse> getAllPayments(Pageable pageable);

    List<PaymentResponse> getPaymentsByTreatmentId(UUID treatmentId);
}

