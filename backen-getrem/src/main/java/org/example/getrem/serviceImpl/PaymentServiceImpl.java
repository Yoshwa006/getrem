package org.example.getrem.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.getrem.dto.billing.CreatePaymentRequest;
import org.example.getrem.dto.billing.PaymentResponse;
import org.example.getrem.exception.NotFoundException;
import org.example.getrem.mapper.PaymentMapper;
import org.example.getrem.model.Payment;
import org.example.getrem.model.Treatment;
import org.example.getrem.repository.PaymentRepository;
import org.example.getrem.repository.TreatmentRepository;
import org.example.getrem.service.PaymentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final TreatmentRepository treatmentRepository;
    private final PaymentMapper paymentMapper;

    @Override
    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        Treatment treatment = treatmentRepository.findById(request.getTreatmentId())
                .orElseThrow(() -> new NotFoundException("Treatment not found with id: " + request.getTreatmentId()));

        Payment payment = paymentMapper.toEntity(request, treatment);
        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toResponse(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(UUID id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment not found with id: " + id));
        return paymentMapper.toResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable)
                .map(paymentMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByTreatmentId(UUID treatmentId) {
        if (!treatmentRepository.existsById(treatmentId)) {
            throw new NotFoundException("Treatment not found with id: " + treatmentId);
        }
        return paymentRepository.findByTreatmentId(treatmentId).stream()
                .map(paymentMapper::toResponse)
                .collect(Collectors.toList());
    }
}

