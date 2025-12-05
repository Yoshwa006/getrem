package org.example.getrem.repository;

import org.example.getrem.model.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID> {

    @Query("SELECT n FROM NotificationLog n WHERE n.reminder.id = :reminderId ORDER BY n.timestamp DESC")
    List<NotificationLog> findByReminderId(@Param("reminderId") UUID reminderId);

    @Query("SELECT n FROM NotificationLog n WHERE n.reminder.appointment.id = :appointmentId ORDER BY n.timestamp DESC")
    List<NotificationLog> findByAppointmentId(@Param("appointmentId") UUID appointmentId);
}

