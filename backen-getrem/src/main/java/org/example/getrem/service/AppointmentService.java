package org.example.getrem.service;

import org.example.getrem.dto.appointment.AppointmentResponse;
import org.example.getrem.dto.appointment.CalendarAppointmentResponse;
import org.example.getrem.dto.appointment.CreateAppointmentRequest;
import org.example.getrem.dto.appointment.UpdateAppointmentRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface AppointmentService {

    AppointmentResponse createAppointment(CreateAppointmentRequest request);

    AppointmentResponse getAppointmentById(UUID id);

    Page<AppointmentResponse> getAllAppointments(Pageable pageable);

    List<AppointmentResponse> getAppointmentsByClientId(UUID clientId);

    AppointmentResponse updateAppointment(UUID id, UpdateAppointmentRequest request);

    void deleteAppointment(UUID id);

    // Calendar endpoints
    List<CalendarAppointmentResponse> getAppointmentsForMonth(int year, int month);

    List<CalendarAppointmentResponse> getAppointmentsForWeek(LocalDate startDate);

    List<CalendarAppointmentResponse> getAppointmentsForDay(LocalDate date);

    List<CalendarAppointmentResponse> getAppointmentsForDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<CalendarAppointmentResponse> getUpcomingAppointments();
}

