package org.example.getrem.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.getrem.dto.reminder.CreateReminderRuleRequest;
import org.example.getrem.dto.reminder.ReminderRuleResponse;
import org.example.getrem.exception.NotFoundException;
import org.example.getrem.model.ReminderRule;
import org.example.getrem.repository.ReminderRuleRepository;
import org.example.getrem.service.ReminderRuleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReminderRuleServiceImpl implements ReminderRuleService {

    private final ReminderRuleRepository reminderRuleRepository;

    @Override
    @Transactional
    public ReminderRuleResponse createReminderRule(CreateReminderRuleRequest request) {
        ReminderRule rule = new ReminderRule();
        mapRequestToEntity(request, rule);
        ReminderRule saved = reminderRuleRepository.save(rule);
        return mapEntityToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ReminderRuleResponse getReminderRuleById(UUID id) {
        ReminderRule rule = reminderRuleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reminder rule not found with id: " + id));
        return mapEntityToResponse(rule);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReminderRuleResponse> getAllReminderRules(Pageable pageable) {
        return reminderRuleRepository.findAll(pageable)
                .map(this::mapEntityToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReminderRuleResponse> getActiveReminderRules() {
        return reminderRuleRepository.findByIsActiveTrue().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReminderRuleResponse updateReminderRule(UUID id, CreateReminderRuleRequest request) {
        ReminderRule rule = reminderRuleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reminder rule not found with id: " + id));
        mapRequestToEntity(request, rule);
        ReminderRule updated = reminderRuleRepository.save(rule);
        return mapEntityToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteReminderRule(UUID id) {
        if (!reminderRuleRepository.existsById(id)) {
            throw new NotFoundException("Reminder rule not found with id: " + id);
        }
        reminderRuleRepository.deleteById(id);
    }

    private void mapRequestToEntity(CreateReminderRuleRequest request, ReminderRule entity) {
        entity.setName(request.getName());
        entity.setHoursBefore(request.getHoursBefore());
        entity.setMinutesBefore(request.getMinutesBefore());
        entity.setIsInstant(request.getIsInstant() != null ? request.getIsInstant() : false);
        entity.setIsCustom(request.getIsCustom() != null ? request.getIsCustom() : false);
        entity.setCustomTime(request.getCustomTime());
        entity.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
    }

    private ReminderRuleResponse mapEntityToResponse(ReminderRule entity) {
        return ReminderRuleResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .hoursBefore(entity.getHoursBefore())
                .minutesBefore(entity.getMinutesBefore())
                .isInstant(entity.getIsInstant())
                .isCustom(entity.getIsCustom())
                .customTime(entity.getCustomTime())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}

