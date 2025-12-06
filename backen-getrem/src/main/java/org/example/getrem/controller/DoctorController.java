package org.example.getrem.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.getrem.dto.doctor.CreateDoctorRequest;
import org.example.getrem.dto.doctor.DoctorResponse;
import org.example.getrem.service.DoctorService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    public ResponseEntity<DoctorResponse> createDoctor(@Valid @RequestBody CreateDoctorRequest request) {
        DoctorResponse response = doctorService.createDoctor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponse> getDoctorById(@PathVariable UUID id) {
        DoctorResponse response = doctorService.getDoctorById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        List<DoctorResponse> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/active")
    public ResponseEntity<List<DoctorResponse>> getActiveDoctors() {
        List<DoctorResponse> doctors = doctorService.getActiveDoctors();
        return ResponseEntity.ok(doctors);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorResponse> updateDoctor(
            @PathVariable UUID id,
            @Valid @RequestBody CreateDoctorRequest request) {
        DoctorResponse response = doctorService.updateDoctor(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable UUID id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<Map<String, Boolean>> checkTimeSlotAvailability(
            @PathVariable UUID id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime appointmentTime,
            @RequestParam(required = false) UUID excludeAppointmentId) {
        boolean available = doctorService.isTimeSlotAvailable(id, appointmentTime, excludeAppointmentId);
        return ResponseEntity.ok(Map.of("available", available));
    }
}

