package org.example.getrem.controller;

import lombok.RequiredArgsConstructor;
import org.example.getrem.model.NotificationLog;
import org.example.getrem.repository.NotificationLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notification-logs")
@RequiredArgsConstructor
public class NotificationLogController {

    private final NotificationLogRepository notificationLogRepository;

    @GetMapping
    public ResponseEntity<Page<NotificationLog>> getAllNotificationLogs(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<NotificationLog> logs = notificationLogRepository.findAll(pageable);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<java.util.List<NotificationLog>> getLogsByAppointmentId(
            @PathVariable UUID appointmentId) {
        java.util.List<NotificationLog> logs = notificationLogRepository.findByAppointmentId(appointmentId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/reminder/{reminderId}")
    public ResponseEntity<java.util.List<NotificationLog>> getLogsByReminderId(
            @PathVariable UUID reminderId) {
        java.util.List<NotificationLog> logs = notificationLogRepository.findByReminderId(reminderId);
        return ResponseEntity.ok(logs);
    }
}

