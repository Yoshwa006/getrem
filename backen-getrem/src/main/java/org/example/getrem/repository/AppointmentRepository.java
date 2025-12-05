package org.example.getrem.repository;

import org.example.getrem.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @Query("SELECT a FROM Appointment a WHERE a.client.id = :clientId")
    List<Appointment> findByClientId(@Param("clientId") UUID clientId);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentTime >= :startDate AND a.appointmentTime < :endDate ORDER BY a.appointmentTime ASC")
    List<Appointment> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM Appointment a WHERE DATE(a.appointmentTime) = DATE(:date) ORDER BY a.appointmentTime ASC")
    List<Appointment> findByDate(@Param("date") LocalDateTime date);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentTime >= :startDate AND a.appointmentTime < :endDate AND a.status = 'SCHEDULED' ORDER BY a.appointmentTime ASC")
    List<Appointment> findUpcomingAppointments(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}

