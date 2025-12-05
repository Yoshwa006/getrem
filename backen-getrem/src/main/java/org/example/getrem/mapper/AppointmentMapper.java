package org.example.getrem.mapper;

import org.example.getrem.dto.appointment.AppointmentResponse;
import org.example.getrem.dto.appointment.CreateAppointmentRequest;
import org.example.getrem.dto.appointment.UpdateAppointmentRequest;
import org.example.getrem.enums.AppointmentStatus;
import org.example.getrem.model.Appointment;
import org.example.getrem.model.Clients;
import org.example.getrem.model.Doctor;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    public Appointment toEntity(CreateAppointmentRequest request, Clients client, Doctor doctor) {
        if (request == null || client == null || doctor == null) {
            return null;
        }
        Appointment appointment = new Appointment();
        appointment.setClient(client);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        return appointment;
    }

    public void updateEntity(Appointment entity, UpdateAppointmentRequest request, Doctor doctor) {
        if (entity == null || request == null) {
            return;
        }
        if (request.getAppointmentTime() != null) {
            entity.setAppointmentTime(request.getAppointmentTime());
        }
        if (request.getDoctorId() != null && doctor != null) {
            entity.setDoctor(doctor);
        }
        if (request.getNotes() != null) {
            entity.setNotes(request.getNotes());
        }
        if (request.getStatus() != null) {
            entity.setStatus(request.getStatus());
        }
    }

    public AppointmentResponse toResponse(Appointment entity) {
        if (entity == null) {
            return null;
        }
        return AppointmentResponse.builder()
                .id(entity.getId())
                .clientId(entity.getClient().getId())
                .clientName(entity.getClient().getName())
                .doctorId(entity.getDoctor().getId())
                .doctorName(entity.getDoctor().getName())
                .doctorSpecialization(entity.getDoctor().getSpecialization())
                .appointmentTime(entity.getAppointmentTime())
                .notes(entity.getNotes())
                .status(entity.getStatus())
                .build();
    }
}

