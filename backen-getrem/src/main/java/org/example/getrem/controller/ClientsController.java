package org.example.getrem.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.getrem.dto.client.ClientProfileDTO;
import org.example.getrem.dto.client.ClientResponse;
import org.example.getrem.dto.client.CreateClientRequest;
import org.example.getrem.dto.client.UpdateClientRequest;
import org.example.getrem.repository.CustomClientProfileRepo;
import org.example.getrem.service.ClientsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientsController {

    private final ClientsService clientsService;
    private final CustomClientProfileRepo customClientProfileRepo;
    @PostMapping
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody CreateClientRequest request) {
        ClientResponse response = clientsService.createClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable UUID id) {
        ClientResponse response = clientsService.getClientById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<ClientResponse>> getAllClients(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ClientResponse> clients = clientsService.getAllClients(pageable);
        return ResponseEntity.ok(clients);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateClientRequest request) {
        ClientResponse response = clientsService.updateClient(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable UUID id) {
        clientsService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/profile/{id}")
    public List<ClientProfileDTO> getClientProfile(@PathVariable UUID id,
                                                   Pageable pageable){
        return customClientProfileRepo.getClientProfile(id, pageable);
    }
}

