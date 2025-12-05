package org.example.getrem.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.getrem.dto.billing.CreateTreatmentRequest;
import org.example.getrem.dto.billing.TreatmentResponse;
import org.example.getrem.exception.NotFoundException;
import org.example.getrem.mapper.TreatmentMapper;
import org.example.getrem.model.Appointment;
import org.example.getrem.model.Clients;
import org.example.getrem.model.Payment;
import org.example.getrem.model.Treatment;
import org.example.getrem.repository.AppointmentRepository;
import org.example.getrem.repository.ClientsRepository;
import org.example.getrem.repository.PaymentRepository;
import org.example.getrem.repository.TreatmentRepository;
import org.example.getrem.service.TreatmentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreatmentServiceImpl implements TreatmentService {

    private final TreatmentRepository treatmentRepository;
    private final ClientsRepository clientsRepository;
    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;
    private final TreatmentMapper treatmentMapper;

    @Override
    @Transactional
    public TreatmentResponse createTreatment(CreateTreatmentRequest request) {
        Clients client = clientsRepository.findById(request.getClientId())
                .orElseThrow(() -> new NotFoundException("Client not found with id: " + request.getClientId()));

        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new NotFoundException("Appointment not found with id: " + request.getAppointmentId()));
        }

        Treatment treatment = treatmentMapper.toEntity(request, client, appointment);
        Treatment savedTreatment = treatmentRepository.save(treatment);
        
        List<Payment> payments = paymentRepository.findByTreatmentId(savedTreatment.getId());
        return treatmentMapper.toResponse(savedTreatment, payments);
    }

    @Override
    @Transactional(readOnly = true)
    public TreatmentResponse getTreatmentById(UUID id) {
        Treatment treatment = treatmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Treatment not found with id: " + id));
        
        List<Payment> payments = paymentRepository.findByTreatmentId(id);
        return treatmentMapper.toResponse(treatment, payments);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TreatmentResponse> getAllTreatments(Pageable pageable) {
        return treatmentRepository.findAll(pageable)
                .map(treatment -> {
                    List<Payment> payments = paymentRepository.findByTreatmentId(treatment.getId());
                    return treatmentMapper.toResponse(treatment, payments);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public List<TreatmentResponse> getTreatmentsByClientId(UUID clientId) {
        if (!clientsRepository.existsById(clientId)) {
            throw new NotFoundException("Client not found with id: " + clientId);
        }
        
        return treatmentRepository.findByClientId(clientId).stream()
                .map(treatment -> {
                    List<Payment> payments = paymentRepository.findByTreatmentId(treatment.getId());
                    return treatmentMapper.toResponse(treatment, payments);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TreatmentResponse> getTreatmentsByAppointmentId(UUID appointmentId) {
        if (!appointmentRepository.existsById(appointmentId)) {
            throw new NotFoundException("Appointment not found with id: " + appointmentId);
        }
        
        return treatmentRepository.findByAppointmentId(appointmentId).stream()
                .map(treatment -> {
                    List<Payment> payments = paymentRepository.findByTreatmentId(treatment.getId());
                    return treatmentMapper.toResponse(treatment, payments);
                })
                .collect(Collectors.toList());
    }
}

