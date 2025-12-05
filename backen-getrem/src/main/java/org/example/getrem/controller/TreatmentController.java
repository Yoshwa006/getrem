package org.example.getrem.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.getrem.dto.billing.CreateTreatmentRequest;
import org.example.getrem.dto.billing.TreatmentResponse;
import org.example.getrem.service.TreatmentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/treatments")
@RequiredArgsConstructor
public class TreatmentController {

    private final TreatmentService treatmentService;

    @PostMapping
    public ResponseEntity<TreatmentResponse> createTreatment(
            @Valid @RequestBody CreateTreatmentRequest request) {
        TreatmentResponse response = treatmentService.createTreatment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TreatmentResponse> getTreatmentById(@PathVariable UUID id) {
        TreatmentResponse response = treatmentService.getTreatmentById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<TreatmentResponse>> getAllTreatments(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<TreatmentResponse> treatments = treatmentService.getAllTreatments(pageable);
        return ResponseEntity.ok(treatments);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<TreatmentResponse>> getTreatmentsByClientId(
            @PathVariable UUID clientId) {
        List<TreatmentResponse> treatments = treatmentService.getTreatmentsByClientId(clientId);
        return ResponseEntity.ok(treatments);
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<TreatmentResponse>> getTreatmentsByAppointmentId(
            @PathVariable UUID appointmentId) {
        List<TreatmentResponse> treatments = treatmentService.getTreatmentsByAppointmentId(appointmentId);
        return ResponseEntity.ok(treatments);
    }
}

