package org.example.getrem.repository;

import org.example.getrem.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    @Query("SELECT p FROM Payment p WHERE p.treatment.id = :treatmentId")
    List<Payment> findByTreatmentId(@Param("treatmentId") UUID treatmentId);
}

