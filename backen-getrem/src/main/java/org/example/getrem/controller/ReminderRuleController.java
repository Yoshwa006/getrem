package org.example.getrem.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.getrem.dto.reminder.CreateReminderRuleRequest;
import org.example.getrem.dto.reminder.ReminderRuleResponse;
import org.example.getrem.service.ReminderRuleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reminder-rules")
@RequiredArgsConstructor
public class ReminderRuleController {

    private final ReminderRuleService reminderRuleService;

    @PostMapping
    public ResponseEntity<ReminderRuleResponse> createReminderRule(
            @Valid @RequestBody CreateReminderRuleRequest request) {
        ReminderRuleResponse response = reminderRuleService.createReminderRule(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReminderRuleResponse> getReminderRuleById(@PathVariable UUID id) {
        ReminderRuleResponse response = reminderRuleService.getReminderRuleById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<ReminderRuleResponse>> getAllReminderRules(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ReminderRuleResponse> rules = reminderRuleService.getAllReminderRules(pageable);
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/active")
    public ResponseEntity<List<ReminderRuleResponse>> getActiveReminderRules() {
        List<ReminderRuleResponse> rules = reminderRuleService.getActiveReminderRules();
        return ResponseEntity.ok(rules);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReminderRuleResponse> updateReminderRule(
            @PathVariable UUID id,
            @Valid @RequestBody CreateReminderRuleRequest request) {
        ReminderRuleResponse response = reminderRuleService.updateReminderRule(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminderRule(@PathVariable UUID id) {
        reminderRuleService.deleteReminderRule(id);
        return ResponseEntity.noContent().build();
    }
}

