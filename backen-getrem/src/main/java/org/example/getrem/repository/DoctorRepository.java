package org.example.getrem.repository;

import org.example.getrem.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    List<Doctor> findByActiveTrue();
    
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentTime = :appointmentTime " +
           "AND a.status != 'CANCELLED' " +
           "AND (:excludeAppointmentId IS NULL OR a.id != :excludeAppointmentId)")
    boolean existsOverlappingAppointment(
        @Param("doctorId") UUID doctorId,
        @Param("appointmentTime") LocalDateTime appointmentTime,
        @Param("excludeAppointmentId") UUID excludeAppointmentId
    );
}

