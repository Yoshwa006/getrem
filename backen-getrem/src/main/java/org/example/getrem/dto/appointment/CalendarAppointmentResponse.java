package org.example.getrem.dto.appointment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.getrem.enums.AppointmentStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarAppointmentResponse {

    private UUID id;
    private UUID clientId;
    private String clientName;
    private UUID doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private LocalDateTime appointmentTime;
    private String notes;
    private AppointmentStatus status;
    private List<ReminderScheduleInfo> reminderSchedules;
}

