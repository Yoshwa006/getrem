package org.example.getrem.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.getrem.dto.appointment.AppointmentResponse;
import org.example.getrem.dto.appointment.CalendarAppointmentResponse;
import org.example.getrem.dto.appointment.CreateAppointmentRequest;
import org.example.getrem.dto.appointment.UpdateAppointmentRequest;
import org.example.getrem.service.AppointmentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody CreateAppointmentRequest request) {
        AppointmentResponse response = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable UUID id) {
        AppointmentResponse response = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<AppointmentResponse>> getAllAppointments(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<AppointmentResponse> appointments = appointmentService.getAllAppointments(pageable);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<AppointmentResponse>> getAppointmentsByClientId(
            @PathVariable UUID clientId) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByClientId(clientId);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentResponse> updateAppointment(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAppointmentRequest request) {
        AppointmentResponse response = appointmentService.updateAppointment(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable UUID id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    // Calendar endpoints
    @GetMapping("/calendar/month")
    public ResponseEntity<List<CalendarAppointmentResponse>> getAppointmentsForMonth(
            @RequestParam int year,
            @RequestParam int month) {
        List<CalendarAppointmentResponse> appointments = appointmentService.getAppointmentsForMonth(year, month);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/calendar/week")
    public ResponseEntity<List<CalendarAppointmentResponse>> getAppointmentsForWeek(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        List<CalendarAppointmentResponse> appointments = appointmentService.getAppointmentsForWeek(startDate);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/calendar/day")
    public ResponseEntity<List<CalendarAppointmentResponse>> getAppointmentsForDay(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<CalendarAppointmentResponse> appointments = appointmentService.getAppointmentsForDay(date);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/calendar/range")
    public ResponseEntity<List<CalendarAppointmentResponse>> getAppointmentsForDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<CalendarAppointmentResponse> appointments = appointmentService.getAppointmentsForDateRange(startDate, endDate);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/calendar/upcoming")
    public ResponseEntity<List<CalendarAppointmentResponse>> getUpcomingAppointments() {
        List<CalendarAppointmentResponse> appointments = appointmentService.getUpcomingAppointments();
        return ResponseEntity.ok(appointments);
    }
}

