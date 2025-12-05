package org.example.getrem.service;

import org.example.getrem.dto.client.ClientResponse;
import org.example.getrem.dto.client.CreateClientRequest;
import org.example.getrem.dto.client.UpdateClientRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ClientsService {

    ClientResponse createClient(CreateClientRequest request);

    ClientResponse getClientById(UUID id);

    Page<ClientResponse> getAllClients(Pageable pageable);

    ClientResponse updateClient(UUID id, UpdateClientRequest request);

    void deleteClient(UUID id);
}

