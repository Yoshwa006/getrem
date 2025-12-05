package org.example.getrem.mapper;

import org.example.getrem.dto.appointment.ReminderScheduleInfo;
import org.example.getrem.model.Reminder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReminderMapper {

    public ReminderScheduleInfo toScheduleInfo(Reminder reminder) {
        if (reminder == null) {
            return null;
        }
        return ReminderScheduleInfo.builder()
                .reminderId(reminder.getId())
                .type(reminder.getType())
                .scheduledTime(reminder.getScheduledTime())
                .status(reminder.getStatus())
                .build();
    }

    public List<ReminderScheduleInfo> toScheduleInfoList(List<Reminder> reminders) {
        if (reminders == null) {
            return List.of();
        }
        return reminders.stream()
                .map(this::toScheduleInfo)
                .collect(Collectors.toList());
    }
}

