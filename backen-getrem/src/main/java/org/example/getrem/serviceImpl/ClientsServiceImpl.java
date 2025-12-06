package org.example.getrem.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.example.getrem.dto.client.ClientResponse;
import org.example.getrem.dto.client.ClientsMapper;
import org.example.getrem.dto.client.CreateClientRequest;
import org.example.getrem.dto.client.UpdateClientRequest;
import org.example.getrem.exception.NotFoundException;
import org.example.getrem.model.Clients;
import org.example.getrem.repository.ClientsRepository;
import org.example.getrem.service.ClientsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientsServiceImpl implements ClientsService {

    private final ClientsRepository clientsRepository;
    private final ClientsMapper clientsMapper;

    @Override
    @Transactional
    public ClientResponse createClient(CreateClientRequest request) {
        Clients client = clientsMapper.toEntity(request);
        Clients savedClient = clientsRepository.save(client);
        return clientsMapper.toResponse(savedClient);
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponse getClientById(UUID id) {
        Clients client = clientsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Client not found with id: " + id));
        return clientsMapper.toResponse(client);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClientResponse> getAllClients(Pageable pageable) {
        return clientsRepository.findAll(pageable)
                .map(clientsMapper::toResponse);
    }

    @Override
    @Transactional
    public ClientResponse updateClient(UUID id, UpdateClientRequest request) {
        Clients client = clientsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Client not found with id: " + id));
        clientsMapper.updateEntity(request, client);
        Clients updatedClient = clientsRepository.save(client);
        return clientsMapper.toResponse(updatedClient);
    }

    @Override
    @Transactional
    public void deleteClient(UUID id) {
        if (!clientsRepository.existsById(id)) {
            throw new NotFoundException("Client not found with id: " + id);
        }
        clientsRepository.deleteById(id);
    }
}

