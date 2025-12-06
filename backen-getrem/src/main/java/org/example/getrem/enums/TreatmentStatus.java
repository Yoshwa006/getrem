package org.example.getrem.enums;

public enum TreatmentStatus {
    SCHEDULED,     // Treatment has been planned but not started
    IN_PROGRESS,   // Treatment is currently being performed
    COMPLETED,     // Treatment successfully finished
    CANCELLED,     // Patient or clinic cancelled
    ON_HOLD,       // Temporarily paused (e.g., waiting for healing)
    FAILED,         // Treatment attempted but not successful
    PLANNED
}
