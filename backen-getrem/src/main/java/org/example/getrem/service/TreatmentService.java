package org.example.getrem.service;

import org.example.getrem.dto.billing.CreateTreatmentRequest;
import org.example.getrem.dto.billing.TreatmentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface TreatmentService {

    TreatmentResponse createTreatment(CreateTreatmentRequest request);

    TreatmentResponse getTreatmentById(UUID id);

    Page<TreatmentResponse> getAllTreatments(Pageable pageable);

    List<TreatmentResponse> getTreatmentsByClientId(UUID clientId);

    List<TreatmentResponse> getTreatmentsByAppointmentId(UUID appointmentId);
}

