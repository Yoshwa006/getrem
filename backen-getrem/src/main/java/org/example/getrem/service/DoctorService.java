package org.example.getrem.service;

import org.example.getrem.dto.doctor.CreateDoctorRequest;
import org.example.getrem.dto.doctor.DoctorResponse;

import java.util.List;
import java.util.UUID;

public interface DoctorService {
    DoctorResponse createDoctor(CreateDoctorRequest request);
    DoctorResponse getDoctorById(UUID id);
    List<DoctorResponse> getAllDoctors();
    List<DoctorResponse> getActiveDoctors();
    DoctorResponse updateDoctor(UUID id, CreateDoctorRequest request);
    void deleteDoctor(UUID id);
    boolean isTimeSlotAvailable(UUID doctorId, java.time.LocalDateTime appointmentTime, UUID excludeAppointmentId);
}

