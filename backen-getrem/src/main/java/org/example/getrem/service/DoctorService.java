package org.example.getrem.service;

import org.example.getrem.dto.doctor.CreateDoctorRequest;
import org.example.getrem.dto.doctor.DoctorResponse;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public interface DoctorService {
    DoctorResponse createDoctor(CreateDoctorRequest request);
    DoctorResponse getDoctorById(UUID id);
    List<DoctorResponse> getAllDoctors();
    List<DoctorResponse> getActiveDoctors();
    DoctorResponse updateDoctor(UUID id, CreateDoctorRequest request);
    void deleteDoctor(UUID id);
    boolean isTimeSlotAvailable(UUID doctorId, OffsetDateTime appointmentTime, UUID excludeAppointmentId);
}

