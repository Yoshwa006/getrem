package org.example.getrem.dto.reminder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderRuleResponse {
    private UUID id;
    private String name;
    private Long hoursBefore;
    private Long minutesBefore;
    private Boolean isInstant;
    private Boolean isCustom;
    private LocalDateTime customTime;
    private Boolean isActive;
    private LocalDateTime createdAt;
}

