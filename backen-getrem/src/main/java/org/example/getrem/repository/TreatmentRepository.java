package org.example.getrem.repository;

import org.example.getrem.model.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, UUID> {

    @Query("SELECT t FROM Treatment t WHERE t.client.id = :clientId")
    List<Treatment> findByClientId(@Param("clientId") UUID clientId);

    @Query("SELECT t FROM Treatment t WHERE t.appointment.id = :appointmentId")
    List<Treatment> findByAppointmentId(@Param("appointmentId") UUID appointmentId);
}

