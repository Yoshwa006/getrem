package org.example.getrem.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.example.getrem.dto.client.ClientProfileDTO;
import org.example.getrem.mapper.ClientProfileMapper;
import org.example.getrem.model.Clients;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Repository
public class CustomClientProfileRepo {

    @PersistenceContext
    private EntityManager em;

    private final ClientProfileMapper mapper = new ClientProfileMapper(); // or inject if you mark it @Component

    public List<ClientProfileDTO> getClientProfile(UUID clientId, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Clients> cq = cb.createQuery(Clients.class);
        Root<Clients> root = cq.from(Clients.class);

        // fetch to avoid N+1
        root.fetch("treatments", JoinType.LEFT)
                .fetch("payments", JoinType.LEFT);

        List<Predicate> predicates = new ArrayList<>();
        if (clientId != null) {
            predicates.add(cb.equal(root.get("id"), clientId));
        }

        cq.where(predicates.toArray(new Predicate[0]));
        cq.select(root).distinct(true);

        TypedQuery<Clients> query = em.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Clients> clients = query.getResultList();

        return clients.stream()
                .map(mapper::toClientProfile)
                .toList();
    }
}
