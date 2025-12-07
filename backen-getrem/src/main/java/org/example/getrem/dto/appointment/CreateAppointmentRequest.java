package org.example.getrem.dto.appointment;

import jakarta.validation.constraints.NotNull;
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
public class CreateAppointmentRequest {

    @NotNull(message = "Client ID is required")
    private UUID clientId;

    @NotNull(message = "Doctor ID is required")
    private UUID doctorId;

    @NotNull(message = "Appointment time is required")
    private LocalDateTime appointmentTime;

    private String notes;

    // New reminder options: "IMMEDIATE", "TEN_MINUTES_BEFORE", "ONE_DAY_BEFORE"
    private java.util.List<String> reminderOptions;

    // Custom reminders with specific date/time
    private java.util.List<LocalDateTime> customReminderTimes;
}

