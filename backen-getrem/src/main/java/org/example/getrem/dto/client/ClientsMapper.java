package org.example.getrem.dto.client;

import org.example.getrem.model.Clients;
import org.springframework.stereotype.Component;

@Component
public class ClientsMapper {

    public ClientResponse toResponse(Clients client) {
        if (client == null) {
            return null;
        }
        return ClientResponse.builder()
                .id(client.getId())
                .name(client.getName())
                .age(client.getAge())
                .gender(client.getGender())
                .phone(client.getPhone())
                .email(client.getEmail())
                .notes(client.getNotes())
                .build();
    }

    public Clients toEntity(CreateClientRequest request) {
        if (request == null) {
            return null;
        }
        Clients client = new Clients();
        client.setName(request.getName());
        client.setAge(request.getAge());
        client.setGender(request.getGender());
        client.setPhone(request.getPhone());
        client.setEmail(request.getEmail());
        client.setNotes(request.getNotes());
        return client;
    }

    public void updateEntity(UpdateClientRequest request, Clients client) {
        if (request == null || client == null) {
            return;
        }
        if (request.getName() != null) {
            client.setName(request.getName());
        }
        if (request.getAge() != null) {
            client.setAge(request.getAge());
        }
        if (request.getGender() != null) {
            client.setGender(request.getGender());
        }
        if (request.getPhone() != null) {
            client.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            client.setEmail(request.getEmail());
        }
        if (request.getNotes() != null) {
            client.setNotes(request.getNotes());
        }
    }
}

