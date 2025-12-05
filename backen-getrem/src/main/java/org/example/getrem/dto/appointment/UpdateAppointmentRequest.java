package org.example.getrem.dto.appointment;

import jakarta.validation.constraints.Future;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.getrem.enums.AppointmentStatus;
import java.util.UUID;

import java.time.LocalDateTime;

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

    private java.util.List<java.util.UUID> reminderRuleIds;

    private java.util.List<LocalDateTime> customReminderTimes;
}

