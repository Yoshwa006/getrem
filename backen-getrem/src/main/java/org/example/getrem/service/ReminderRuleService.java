package org.example.getrem.service;

import org.example.getrem.dto.reminder.CreateReminderRuleRequest;
import org.example.getrem.dto.reminder.ReminderRuleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ReminderRuleService {
    ReminderRuleResponse createReminderRule(CreateReminderRuleRequest request);
    ReminderRuleResponse getReminderRuleById(UUID id);
    Page<ReminderRuleResponse> getAllReminderRules(Pageable pageable);
    List<ReminderRuleResponse> getActiveReminderRules();
    ReminderRuleResponse updateReminderRule(UUID id, CreateReminderRuleRequest request);
    void deleteReminderRule(UUID id);
}

