package org.example.getrem.service;

import org.example.getrem.model.Appointment;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ReminderService {

    void scheduleRemindersForAppointment(Appointment appointment, List<String> reminderOptions, List<LocalDateTime> customReminderTimes);

    void scheduleRemindersForAppointment(Appointment appointment);

    void cancelRemindersForAppointment(UUID appointmentId);

    void rescheduleRemindersForAppointment(Appointment appointment, List<String> reminderOptions, List<LocalDateTime> customReminderTimes);

    void rescheduleRemindersForAppointment(Appointment appointment);
}
