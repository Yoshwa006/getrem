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
    
    // Check for overlapping appointments (assuming 30-minute appointment duration)
    // Two appointments overlap if:
    // - New start time is before existing end time AND
    // - New end time is after existing start time
    // Existing: [a.appointment_time, a.appointment_time + 30 min]
    // New: [:appointmentTime, :appointmentTime + 30 min]
    // Overlap if: :appointmentTime < (a.appointment_time + 30 min) AND (:appointmentTime + 30 min) > a.appointment_time
    @Query(value = """
    SELECT COUNT(*)
    FROM appointment a
    WHERE a.doctor_id = :doctorId
      AND a.status <> 'CANCELLED'
      AND (:excludeAppointmentId IS NULL OR a.id <> :excludeAppointmentId)
      AND :appointmentTime < DATE_ADD(a.appointment_time, INTERVAL 30 MINUTE)
      AND DATE_ADD(:appointmentTime, INTERVAL 30 MINUTE) > a.appointment_time
    """, nativeQuery = true)
    Long countOverlappingAppointments(
            @Param("doctorId") UUID doctorId,
            @Param("appointmentTime") LocalDateTime appointmentTime,
            @Param("excludeAppointmentId") UUID excludeAppointmentId
    );


}

