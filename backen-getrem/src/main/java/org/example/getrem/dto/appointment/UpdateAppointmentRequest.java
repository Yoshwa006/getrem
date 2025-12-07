package org.example.getrem.dto.appointment;

import jakarta.validation.constraints.Future;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.getrem.enums.AppointmentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAppointmentRequest {

    @Future(message = "Appointment time must be in the future")
    private LocalDateTime appointmentTime;

    private UUID doctorId;

    private String notes;

    private AppointmentStatus status;

    // New reminder options: "IMMEDIATE", "TEN_MINUTES_BEFORE", "ONE_DAY_BEFORE"
    private java.util.List<String> reminderOptions;

    // Custom reminders with specific date/time
    private java.util.List<LocalDateTime> customReminderTimes;
}

