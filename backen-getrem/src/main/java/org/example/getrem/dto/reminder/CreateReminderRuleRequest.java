package org.example.getrem.dto.reminder;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReminderRuleRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private Long hoursBefore;
    private Long minutesBefore;
    private Boolean isInstant = false;
    private Boolean isCustom = false;
    private LocalDateTime customTime;
    private Boolean isActive = true;
}

