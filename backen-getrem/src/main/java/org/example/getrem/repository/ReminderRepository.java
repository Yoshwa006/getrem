package org.example.getrem.repository;

import org.example.getrem.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, UUID> {

    @Query("SELECT r FROM Reminder r WHERE r.appointment.id = :appointmentId")
    List<Reminder> findByAppointmentId(@Param("appointmentId") UUID appointmentId);

    @Query("SELECT r FROM Reminder r WHERE r.status = 'PENDING' AND r.scheduledTime <= :currentTime")
    List<Reminder> findPendingRemindersToSend(@Param("currentTime") LocalDateTime currentTime);

}

