package org.example.getrem.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reminder_rule")
@Getter
@Setter
public class ReminderRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "hours_before")
    private Long hoursBefore;

    @Column(name = "minutes_before")
    private Long minutesBefore;

    @Column(name = "is_instant")
    private Boolean isInstant = false;

    @Column(name = "is_custom")
    private Boolean isCustom = false;

    @Column(name = "custom_time")
    private LocalDateTime customTime;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

