package org.example.getrem.dto.doctor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDoctorRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String specialization;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    private Boolean active = true;
}

