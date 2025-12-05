package org.example.getrem.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.getrem.enums.ReminderStatus;
import org.example.getrem.enums.ReminderType;
import org.example.getrem.model.Appointment;
import org.example.getrem.model.Reminder;
import org.example.getrem.model.ReminderRule;
import org.example.getrem.repository.ReminderRepository;
import org.example.getrem.repository.ReminderRuleRepository;
import org.example.getrem.service.NotificationService;
import org.example.getrem.service.ReminderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderServiceImpl implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final ReminderRuleRepository reminderRuleRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void scheduleRemindersForAppointment(Appointment appointment, List<UUID> reminderRuleIds, List<LocalDateTime> customReminderTimes) {
        if (appointment == null || appointment.getAppointmentTime() == null) {
            return;
        }

        LocalDateTime appointmentTime = appointment.getAppointmentTime();
        LocalDateTime now = LocalDateTime.now();

        // Schedule reminders based on reminder rules
        if (reminderRuleIds != null && !reminderRuleIds.isEmpty()) {
            List<ReminderRule> rules = reminderRuleRepository.findAllById(reminderRuleIds);
            for (ReminderRule rule : rules) {
                if (rule.getIsActive()) {
                    LocalDateTime scheduledTime = calculateScheduledTime(appointmentTime, rule);
                    if (scheduledTime != null && scheduledTime.isAfter(now)) {
                        Reminder reminder = createReminder(appointment, ReminderType.TEN_DAYS_BEFORE, scheduledTime);
                        reminderRepository.save(reminder);
                        
                        // Send immediately if instant
                        if (rule.getIsInstant() != null && rule.getIsInstant()) {
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
                    Reminder reminder = createReminder(appointment, ReminderType.ONE_TO_TWO_HOURS_BEFORE, customTime);
                    reminderRepository.save(reminder);
                }
            }
        }

        // Always send immediate confirmation
        Reminder immediateReminder = createReminder(appointment, ReminderType.IMMEDIATE_CONFIRMATION, now);
        reminderRepository.save(immediateReminder);
        sendImmediateConfirmation(immediateReminder, appointment);
    }

    @Override
    @Transactional
    public void scheduleRemindersForAppointment(Appointment appointment) {
        // Default behavior - use old logic for backward compatibility
        if (appointment == null || appointment.getAppointmentTime() == null) {
            return;
        }

        LocalDateTime appointmentTime = appointment.getAppointmentTime();
        LocalDateTime now = LocalDateTime.now();

        // 1. Immediate confirmation
        Reminder immediateReminder = createReminder(appointment, ReminderType.IMMEDIATE_CONFIRMATION, now);
        reminderRepository.save(immediateReminder);
        sendImmediateConfirmation(immediateReminder, appointment);

        // 2. 10 days before appointment
        LocalDateTime tenDaysBefore = appointmentTime.minusDays(10);
        if (tenDaysBefore.isAfter(now)) {
            Reminder tenDaysReminder = createReminder(appointment, ReminderType.TEN_DAYS_BEFORE, tenDaysBefore);
            reminderRepository.save(tenDaysReminder);
        }

        // 3. 1-2 hours before appointment (using 1.5 hours as average)
        LocalDateTime oneToTwoHoursBefore = appointmentTime.minus(90, ChronoUnit.MINUTES);
        if (oneToTwoHoursBefore.isAfter(now)) {
            Reminder shortTermReminder = createReminder(appointment, ReminderType.ONE_TO_TWO_HOURS_BEFORE, oneToTwoHoursBefore);
            reminderRepository.save(shortTermReminder);
        }
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
    public void rescheduleRemindersForAppointment(Appointment appointment, List<UUID> reminderRuleIds, List<LocalDateTime> customReminderTimes) {
        cancelRemindersForAppointment(appointment.getId());
        scheduleRemindersForAppointment(appointment, reminderRuleIds, customReminderTimes);
    }

    @Override
    @Transactional
    public void rescheduleRemindersForAppointment(Appointment appointment) {
        cancelRemindersForAppointment(appointment.getId());
        scheduleRemindersForAppointment(appointment);
    }

    private LocalDateTime calculateScheduledTime(LocalDateTime appointmentTime, ReminderRule rule) {
        if (rule.getIsInstant() != null && rule.getIsInstant()) {
            return LocalDateTime.now();
        }
        
        if (rule.getIsCustom() != null && rule.getIsCustom() && rule.getCustomTime() != null) {
            return rule.getCustomTime();
        }
        
        LocalDateTime scheduledTime = appointmentTime;
        if (rule.getHoursBefore() != null && rule.getHoursBefore() > 0) {
            scheduledTime = scheduledTime.minusHours(rule.getHoursBefore());
        }
        if (rule.getMinutesBefore() != null && rule.getMinutesBefore() > 0) {
            scheduledTime = scheduledTime.minusMinutes(rule.getMinutesBefore());
        }
        
        return scheduledTime;
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
