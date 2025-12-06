package org.example.getrem.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.getrem.enums.ReminderStatus;
import org.example.getrem.enums.ReminderType;
import org.example.getrem.model.Appointment;
import org.example.getrem.model.Reminder;
import org.example.getrem.repository.ReminderRepository;
import org.example.getrem.service.NotificationService;
import org.example.getrem.service.ReminderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderServiceImpl implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void scheduleRemindersForAppointment(Appointment appointment, List<String> reminderOptions, List<LocalDateTime> customReminderTimes) {
        if (appointment == null || appointment.getAppointmentTime() == null) {
            return;
        }

        LocalDateTime appointmentTime = appointment.getAppointmentTime();
        LocalDateTime now = LocalDateTime.now();
        ReminderType type = null;
        // Schedule reminders based on selected options
        if (reminderOptions != null && !reminderOptions.isEmpty()) {
            for (String option : reminderOptions) {
                LocalDateTime scheduledTime = null;


                switch (option) {
                    case "IMMEDIATE":
                        scheduledTime = now;
                        type = ReminderType.IMMEDIATE;
                        break;
                    case "TEN_MINUTES_BEFORE":
                        scheduledTime = appointmentTime.minusMinutes(10);
                        type = ReminderType.TEN_MINUTES_BEFORE;
                        break;
                    case "ONE_DAY_BEFORE":
                        scheduledTime = appointmentTime.minusDays(1);
                        type = ReminderType.ONE_DAY_BEFORE;
                        break;
                }

                if (scheduledTime != null && type != null) {
                    if (scheduledTime.isAfter(now) || option.equals("IMMEDIATE")) {
                        Reminder reminder = createReminder(appointment, type, scheduledTime);
                        reminderRepository.save(reminder);
                        
                        // Send immediately if instant
                        if (option.equals("IMMEDIATE")) {
                            sendImmediateConfirmation(reminder, appointment);
                        }
                    }
                }
            }
        }

        // Schedule custom reminder times
        if (customReminderTimes != null && !customReminderTimes.isEmpty()) {
            for (LocalDateTime customTime : customReminderTimes) {
                if (customTime.isAfter(now) && customTime.isBefore(appointmentTime)) {
                    Reminder reminder = createReminder(appointment, ReminderType.CUSTOM, customTime);
                    reminderRepository.save(reminder);
                }
            }
        }
    }

    @Override
    @Transactional
    public void scheduleRemindersForAppointment(Appointment appointment) {
        // Default behavior - send immediate confirmation only
        if (appointment == null || appointment.getAppointmentTime() == null) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        // Send immediate confirmation
        Reminder immediateReminder = createReminder(appointment, ReminderType.IMMEDIATE, now);
        reminderRepository.save(immediateReminder);
        sendImmediateConfirmation(immediateReminder, appointment);
    }

    @Override
    @Transactional
    public void cancelRemindersForAppointment(UUID appointmentId) {
        List<Reminder> reminders = reminderRepository.findByAppointmentId(appointmentId);
        reminders.forEach(reminder -> {
            if (reminder.getStatus() == ReminderStatus.PENDING) {
                reminder.setStatus(ReminderStatus.CANCELLED);
                reminderRepository.save(reminder);
            }
        });
    }

    @Override
    @Transactional
    public void rescheduleRemindersForAppointment(Appointment appointment, List<String> reminderOptions, List<LocalDateTime> customReminderTimes) {
        cancelRemindersForAppointment(appointment.getId());
        scheduleRemindersForAppointment(appointment, reminderOptions, customReminderTimes);
    }

    @Override
    @Transactional
    public void rescheduleRemindersForAppointment(Appointment appointment) {
        cancelRemindersForAppointment(appointment.getId());
        scheduleRemindersForAppointment(appointment);
    }


    private Reminder createReminder(Appointment appointment, ReminderType type, LocalDateTime scheduledTime) {
        Reminder reminder = new Reminder();
        reminder.setAppointment(appointment);
        reminder.setType(type);
        reminder.setScheduledTime(scheduledTime);
        reminder.setStatus(ReminderStatus.PENDING);
        reminder.setCreatedAt(LocalDateTime.now());
        return reminder;
    }

    private void sendImmediateConfirmation(Reminder reminder, Appointment appointment) {
        try {
            String phoneNumber = appointment.getClient().getPhone();
            String email = appointment.getClient().getEmail();
            
            notificationService.sendAllChannelNotifications(reminder, phoneNumber, email);
            reminder.setStatus(ReminderStatus.SENT);
            reminder.setSentAt(LocalDateTime.now());
            reminderRepository.save(reminder);
        } catch (Exception e) {
            log.error("Failed to send immediate confirmation for reminder {}", reminder.getId(), e);
            reminder.setStatus(ReminderStatus.FAILED);
            reminderRepository.save(reminder);
        }
    }
}
