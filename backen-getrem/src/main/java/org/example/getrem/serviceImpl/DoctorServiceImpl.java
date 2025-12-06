package org.example.getrem.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.example.getrem.dto.doctor.CreateDoctorRequest;
import org.example.getrem.dto.doctor.DoctorResponse;
import org.example.getrem.exception.NotFoundException;
import org.example.getrem.model.Doctor;
import org.example.getrem.repository.DoctorRepository;
import org.example.getrem.service.DoctorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Override
    @Transactional
    public DoctorResponse createDoctor(CreateDoctorRequest request) {
        Doctor doctor = new Doctor();
        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setEmail(request.getEmail());
        doctor.setPhone(request.getPhone());
        doctor.setActive(request.getActive() != null ? request.getActive() : true);
        
        Doctor saved = doctorRepository.save(doctor);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DoctorResponse getDoctorById(UUID id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Doctor not found with id: " + id));
        return mapToResponse(doctor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponse> getActiveDoctors() {
        return doctorRepository.findByActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DoctorResponse updateDoctor(UUID id, CreateDoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Doctor not found with id: " + id));
        
        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setEmail(request.getEmail());
        doctor.setPhone(request.getPhone());
        if (request.getActive() != null) {
            doctor.setActive(request.getActive());
        }
        
        Doctor updated = doctorRepository.save(doctor);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteDoctor(UUID id) {
        if (!doctorRepository.existsById(id)) {
            throw new NotFoundException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isTimeSlotAvailable(UUID doctorId, OffsetDateTime appointmentTime, UUID excludeAppointmentId) {
        Long overlappingCount = doctorRepository.countOverlappingAppointments(doctorId, appointmentTime.toLocalDateTime(), excludeAppointmentId);
        return overlappingCount == null || overlappingCount == 0;
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return DoctorResponse.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .specialization(doctor.getSpecialization())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .active(doctor.getActive())
                .build();
    }
}

