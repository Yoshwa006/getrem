package org.example.getrem.service;

import org.example.getrem.enums.NotificationChannel;
import org.example.getrem.model.Reminder;

public interface NotificationService {

    void sendNotification(Reminder reminder, NotificationChannel channel, String recipient);

    void sendAllChannelNotifications(Reminder reminder, String phoneNumber, String email);

    void sendTestEmail(String to, String subject, String body);
}

