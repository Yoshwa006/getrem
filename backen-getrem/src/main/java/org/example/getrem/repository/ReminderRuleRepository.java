package org.example.getrem.repository;

import org.example.getrem.model.ReminderRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReminderRuleRepository extends JpaRepository<ReminderRule, UUID> {
    List<ReminderRule> findByIsActiveTrue();
}

