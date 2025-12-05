package org.example.getrem.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.getrem.enums.ReminderStatus;
import org.example.getrem.model.Reminder;
import org.example.getrem.repository.ReminderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderSchedulerService {

    private final ReminderRepository reminderRepository;
    private final NotificationService notificationService;

    /**
     * Runs every minute to check for pending reminders that need to be sent
     */
    @Scheduled(fixedRate = 60000) // Run every 60 seconds
    @Transactional
    public void processPendingReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<Reminder> pendingReminders = reminderRepository.findPendingRemindersToSend(now);
        
        for (Reminder reminder : pendingReminders) {
            try {
                String phoneNumber = reminder.getAppointment().getClient().getPhone();
                String email = reminder.getAppointment().getClient().getEmail();
                
                notificationService.sendAllChannelNotifications(reminder, phoneNumber, email);
                
                reminder.setStatus(ReminderStatus.SENT);
                reminder.setSentAt(LocalDateTime.now());
                reminderRepository.save(reminder);
                
                log.info("Successfully sent reminder {} for appointment {}", 
                    reminder.getId(), reminder.getAppointment().getId());
            } catch (Exception e) {
                log.error("Failed to process reminder {}", reminder.getId(), e);
                reminder.setStatus(ReminderStatus.FAILED);
                reminderRepository.save(reminder);
            }
        }
    }
}

