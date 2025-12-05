package org.example.getrem.dto.appointment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.getrem.enums.ReminderStatus;
import org.example.getrem.enums.ReminderType;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderScheduleInfo {

    private UUID reminderId;
    private ReminderType type;
    private LocalDateTime scheduledTime;
    private ReminderStatus status;
}

