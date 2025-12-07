//package org.example.getrem.model;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//import org.example.getrem.enums.ClientStatus;
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//@Entity
//@Getter
//@Setter
//public class ClientProfile {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    private UUID id;
//
//    @OneToOne
//    @JoinColumn(name="client_id")
//    private Clients clients;
//
//    private LocalDateTime joinedAt;
//
//    private Long total_amount;
//    private Long pending_amount;
//    private Long paid_amount;
//
//    private ClientStatus status;
//
//    public ClientProfile(){
//        this.status = clients.getStatus();
//    }
//}
