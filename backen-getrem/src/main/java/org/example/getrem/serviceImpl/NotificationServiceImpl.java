package org.example.getrem.serviceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.getrem.enums.NotificationChannel;
import org.example.getrem.enums.NotificationStatus;
import org.example.getrem.model.Appointment;
import org.example.getrem.model.NotificationLog;
import org.example.getrem.model.Reminder;
import org.example.getrem.repository.NotificationLogRepository;
import org.example.getrem.service.NotificationService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationLogRepository notificationLogRepository;
    private final JavaMailSender mailSender;

    @Override
    @Transactional
    public void sendNotification(Reminder reminder, NotificationChannel channel, String recipient) {
        NotificationLog notificationLog = new NotificationLog();
        notificationLog.setReminder(reminder);
        notificationLog.setChannel(channel);
        notificationLog.setRecipient(recipient);
        notificationLog.setTimestamp(LocalDateTime.now());

        try {
            boolean success = false;
            
            if (channel == NotificationChannel.EMAIL) {
                success = sendEmail(recipient, reminder);
            } else {
                // For WhatsApp and SMS, keep placeholder for now
                log.info("Sending {} notification to {} for reminder {}", channel, recipient, reminder.getId());
                success = true; // Placeholder
            }
            
            if (success) {
                notificationLog.setStatus(NotificationStatus.SENT);
            } else {
                notificationLog.setStatus(NotificationStatus.FAILED);
                notificationLog.setErrorMessage("Failed to send notification");
            }
        } catch (Exception e) {
            log.error("Error sending notification via {} to {}", channel, recipient, e);
            notificationLog.setStatus(NotificationStatus.FAILED);
            notificationLog.setErrorMessage(e.getMessage());
        }

        notificationLogRepository.save(notificationLog);
    }

    @Override
    @Transactional
    public void sendAllChannelNotifications(Reminder reminder, String phoneNumber, String email) {
        if (email != null && !email.isEmpty()) {
            sendNotification(reminder, NotificationChannel.EMAIL, email);
        }
        
        // WhatsApp and SMS can be added later
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            log.info("SMS/WhatsApp notifications not yet implemented for {}", phoneNumber);
        }
    }

    @Override
    @Transactional
    public void sendTestEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("Test email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send test email to {}", to, e);
            throw new RuntimeException("Failed to send test email: " + e.getMessage(), e);
        }
    }

    private boolean sendEmail(String recipient, Reminder reminder) {
        try {
            Appointment appointment = reminder.getAppointment();
            String clientName = appointment.getClient().getName();
            String appointmentTime = appointment.getAppointmentTime()
                    .format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' HH:mm"));
            
            String subject = "Appointment Reminder - " + clientName;
            String body = buildEmailBody(clientName, appointmentTime, appointment.getNotes(), reminder);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(body);
            
            mailSender.send(message);
            log.info("Email sent successfully to {} for appointment {}", recipient, appointment.getId());
            return true;
        } catch (Exception e) {
            log.error("Failed to send email to {}", recipient, e);
            return false;
        }
    }

    private String buildEmailBody(String clientName, String appointmentTime, String notes, Reminder reminder) {
        StringBuilder body = new StringBuilder();
        body.append("Dear ").append(clientName).append(",\n\n");
        body.append("This is a reminder for your upcoming appointment.\n\n");
        body.append("Appointment Details:\n");
        body.append("Date & Time: ").append(appointmentTime).append("\n");
        
        if (notes != null && !notes.isEmpty()) {
            body.append("Notes: ").append(notes).append("\n");
        }
        
        body.append("\nReminder Type: ").append(reminder.getType()).append("\n");
        body.append("\nPlease arrive on time for your appointment.\n\n");
        body.append("Thank you,\n");
        body.append("GetRem Dental Clinic");
        
        return body.toString();
    }
}
