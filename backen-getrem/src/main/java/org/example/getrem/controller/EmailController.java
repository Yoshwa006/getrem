package org.example.getrem.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.getrem.dto.reminder.TestEmailRequest;
import org.example.getrem.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
public class EmailController {

    private final NotificationService notificationService;

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> sendTestEmail(
            @Valid @RequestBody TestEmailRequest request) {
        try {
            notificationService.sendTestEmail(request.getTo(), request.getSubject(), request.getBody());
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Test email sent successfully to " + request.getTo());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Failed to send test email: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

