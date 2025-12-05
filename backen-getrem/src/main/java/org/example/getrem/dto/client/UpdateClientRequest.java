package org.example.getrem.dto.client;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.getrem.enums.Gender;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateClientRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @Positive(message = "Age must be positive")
    private Integer age;

    private Gender gender;

    private String phone;

    private String email;

    private String notes;
}

