    package org.example.getrem.service.impl;

    import lombok.RequiredArgsConstructor;
    import org.example.getrem.dto.appointment.AppointmentResponse;
    import org.example.getrem.dto.appointment.CalendarAppointmentResponse;
    import org.example.getrem.dto.appointment.CreateAppointmentRequest;
    import org.example.getrem.dto.appointment.UpdateAppointmentRequest;
    import org.example.getrem.exception.NotFoundException;
    import org.example.getrem.exception.ValidationException;
    import org.example.getrem.mapper.AppointmentMapper;
    import org.example.getrem.mapper.ReminderMapper;
    import org.example.getrem.model.Appointment;
    import org.example.getrem.model.Clients;
    import org.example.getrem.model.Doctor;
    import org.example.getrem.model.Reminder;
    import org.example.getrem.repository.AppointmentRepository;
    import org.example.getrem.repository.ClientsRepository;
    import org.example.getrem.repository.DoctorRepository;
    import org.example.getrem.repository.ReminderRepository;
    import org.example.getrem.service.AppointmentService;
    import org.example.getrem.service.ReminderService;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;
    import java.util.UUID;
    import java.util.stream.Collectors;

    @Service
    @RequiredArgsConstructor
    public class AppointmentServiceImpl implements AppointmentService {

        private final AppointmentRepository appointmentRepository;
        private final ClientsRepository clientsRepository;
        private final DoctorRepository doctorRepository;
        private final AppointmentMapper appointmentMapper;
        private final ReminderRepository reminderRepository;
        private final ReminderMapper reminderMapper;
        private final ReminderService reminderService;

        @Override
        @Transactional
        public AppointmentResponse createAppointment(CreateAppointmentRequest request) {
            Clients client = clientsRepository.findById(request.getClientId())
                    .orElseThrow(() -> new NotFoundException("Client not found with id: " + request.getClientId()));

            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new NotFoundException("Doctor not found with id: " + request.getDoctorId()));

            // Validate no overlapping appointments for the same doctor
            Long overlappingCount = doctorRepository.countOverlappingAppointments(request.getDoctorId(), request.getAppointmentTime(), null);
            if (overlappingCount != null && overlappingCount > 0) {
                throw new ValidationException("This time slot is already booked for Dr. " + doctor.getName());
            }

            Appointment appointment = appointmentMapper.toEntity(request, client, doctor);
            Appointment savedAppointment = appointmentRepository.save(appointment);

            // Schedule reminders for the new appointment
            if (request.getReminderOptions() != null || request.getCustomReminderTimes() != null) {
                reminderService.scheduleRemindersForAppointment(
                    savedAppointment,
                    request.getReminderOptions(),
                    request.getCustomReminderTimes()
                );
            } else {
                reminderService.scheduleRemindersForAppointment(savedAppointment);
            }

            return appointmentMapper.toResponse(savedAppointment);
        }

        @Override
        @Transactional(readOnly = true)
        public AppointmentResponse getAppointmentById(UUID id) {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Appointment not found with id: " + id));
            return appointmentMapper.toResponse(appointment);
        }

        @Override
        @Transactional(readOnly = true)
        public Page<AppointmentResponse> getAllAppointments(Pageable pageable) {
            return appointmentRepository.findAll(pageable)
                    .map(appointmentMapper::toResponse);
        }

        @Override
        @Transactional(readOnly = true)
        public List<AppointmentResponse> getAppointmentsByClientId(UUID clientId) {
            if (!clientsRepository.existsById(clientId)) {
                throw new NotFoundException("Client not found with id: " + clientId);
            }
            return appointmentRepository.findByClientId(clientId).stream()
                    .map(appointmentMapper::toResponse)
                    .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public AppointmentResponse updateAppointment(UUID id, UpdateAppointmentRequest request) {
            Appointment appointment = appointmentRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Appointment not found with id: " + id));

            // Determine which doctor to use (new one from request or existing)
            UUID doctorId = request.getDoctorId() != null ? request.getDoctorId() : appointment.getDoctor().getId();
            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new NotFoundException("Doctor not found with id: " + doctorId));

            // Check if appointment time or doctor changed
            LocalDateTime newAppointmentTime = request.getAppointmentTime() != null
                ? request.getAppointmentTime()
                : appointment.getAppointmentTime();
            boolean timeChanged = request.getAppointmentTime() != null
                && !appointment.getAppointmentTime().equals(request.getAppointmentTime());
            boolean doctorChanged = request.getDoctorId() != null
                && !appointment.getDoctor().getId().equals(request.getDoctorId());

            // Validate no overlapping appointments for the same doctor (excluding current appointment)
            if (timeChanged || doctorChanged) {
                Long overlappingCount = doctorRepository.countOverlappingAppointments(doctorId, newAppointmentTime, id);
                if (overlappingCount != null && overlappingCount > 0) {
                    throw new ValidationException("This time slot is already booked for Dr. " + doctor.getName());
                }
            }

            appointmentMapper.updateEntity(appointment, request, doctor);
            Appointment updatedAppointment = appointmentRepository.save(appointment);

            // Reschedule reminders if appointment time changed or reminder options changed
            if (timeChanged || request.getReminderOptions() != null || request.getCustomReminderTimes() != null) {
                if (request.getReminderOptions() != null || request.getCustomReminderTimes() != null) {
                    reminderService.rescheduleRemindersForAppointment(
                        updatedAppointment,
                        request.getReminderOptions(),
                        request.getCustomReminderTimes()
                    );
                } else {
                    reminderService.rescheduleRemindersForAppointment(updatedAppointment);
                }
            }

            return appointmentMapper.toResponse(updatedAppointment);
        }

        @Override
        @Transactional
        public void deleteAppointment(UUID id) {
            if (!appointmentRepository.existsById(id)) {
                throw new NotFoundException("Appointment not found with id: " + id);
            }

            // Cancel all reminders before deleting appointment
            reminderService.cancelRemindersForAppointment(id);

            appointmentRepository.deleteById(id);
        }

        @Override
        @Transactional(readOnly = true)
        public List<CalendarAppointmentResponse> getAppointmentsForMonth(int year, int month) {
            try {
                LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
                LocalDateTime endDate = startDate.plusMonths(1);
                return getAppointmentsForDateRange(startDate, endDate);
            } catch (Exception e) {
                // Log error and return empty list to prevent UI errors
                e.printStackTrace();
                return new ArrayList<>();
            }
        }

        @Override
        @Transactional(readOnly = true)
        public List<CalendarAppointmentResponse> getAppointmentsForWeek(LocalDate startDate) {
            try {
                LocalDateTime start = startDate.atStartOfDay();
                LocalDateTime end = start.plusWeeks(1);
                return getAppointmentsForDateRange(start, end);
            } catch (Exception e) {
                e.printStackTrace();
                return new ArrayList<>();
            }
        }

        @Override
        @Transactional(readOnly = true)
        public List<CalendarAppointmentResponse> getAppointmentsForDay(LocalDate date) {
            try {
                LocalDateTime start = date.atStartOfDay();
                LocalDateTime end = start.plusDays(1);
                return getAppointmentsForDateRange(start, end);
            } catch (Exception e) {
                e.printStackTrace();
                return new ArrayList<>();
            }
        }

        @Override
        @Transactional(readOnly = true)
        public List<CalendarAppointmentResponse> getAppointmentsForDateRange(LocalDateTime startDate, LocalDateTime endDate) {
            try {
                List<Appointment> appointments = appointmentRepository.findByDateRange(startDate, endDate);
                return appointments.stream()
                        .map(this::toCalendarResponse)
                        .collect(Collectors.toList());
            } catch (Exception e) {
                e.printStackTrace();
                return new ArrayList<>();
            }
        }

        @Override
        @Transactional(readOnly = true)
        public List<CalendarAppointmentResponse> getUpcomingAppointments() {
            try {
                LocalDateTime now = LocalDateTime.now();
                LocalDateTime endDate = now.plusMonths(3); // Next 3 months
                List<Appointment> appointments = appointmentRepository.findUpcomingAppointments(now, endDate);
                return appointments.stream()
                        .map(this::toCalendarResponse)
                        .collect(Collectors.toList());
            } catch (Exception e) {
                e.printStackTrace();
                return new ArrayList<>();
            }
        }

        private CalendarAppointmentResponse toCalendarResponse(Appointment appointment) {
            List<Reminder> reminders = new ArrayList<>();
            try {
                reminders = reminderRepository.findByAppointmentId(appointment.getId());
            } catch (Exception e) {
                e.printStackTrace();
                // fallback: return appointment with empty reminderSchedules
            }

            String doctorSpecialization = "";
            try {
                doctorSpecialization = appointment.getDoctor().getSpecialization();
            } catch (Exception e) {
                // Fallback for missing specialization
            }

            return CalendarAppointmentResponse.builder()
                    .id(appointment.getId())
                    .clientId(appointment.getClient().getId())
                    .clientName(appointment.getClient().getName())
                    .doctorId(appointment.getDoctor().getId())
                    .doctorName(appointment.getDoctor().getName())
                    .doctorSpecialization(doctorSpecialization)
                    .appointmentTime(appointment.getAppointmentTime())
                    .notes(appointment.getNotes())
                    .status(appointment.getStatus())
                    .reminderSchedules(reminderMapper.toScheduleInfoList(reminders))
                    .build();
        }
    }

